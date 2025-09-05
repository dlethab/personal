// ResumePage.jsx
import React, { useRef, useEffect, useState } from "react";
import resumePDF from "../assets/Dlet Habtemariam - Resume.pdf";
import * as pdfjsLib from "pdfjs-dist/webpack";
import { Link } from "react-router-dom"

const ResumePage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 450);
  const canvasRef = useRef(null);
  const iframeRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Handle window resize
useEffect(() => {
  if (!isMobile) return;

  let renderTask = null; // keep track of current render task

  const renderPDF = async () => {
    const pdf = await pdfjsLib.getDocument(resumePDF).promise;
    const page = await pdf.getPage(1);

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // scale to fit screen width
    const viewport = page.getViewport({ scale: 1 });
    const screenWidth = window.innerWidth - 20; // 10px padding each side
    const scale = screenWidth / viewport.width;
    setScale(scale);

    const scaledViewport = page.getViewport({ scale });
    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;

    // Cancel previous render if it exists
    if (renderTask) {
      try {
        renderTask.cancel();
      } catch (err) {
        // ignore cancellation errors
      }
    }

    // Start new render task
    renderTask = page.render({
      canvasContext: context,
      viewport: scaledViewport,
    });

    try {
      await renderTask.promise;
    } catch (err) {
      if (err?.name === "RenderingCancelledException") {
        // this is fine, previous render was cancelled
      } else {
        console.error(err);
      }
    }
  };

  renderPDF();

  const handleResizePDF = () => renderPDF();
  window.addEventListener("resize", handleResizePDF);

  return () => {
    if (renderTask) {
      try {
        renderTask.cancel();
      } catch {}
    }
    window.removeEventListener("resize", handleResizePDF);
  };
}, [isMobile, scale, setIsMobile]);


  return (
    <main
      style={{
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",  // ← stack children vertically
        justifyContent: "flex-start",
        alignItems: "center",      // center horizontally
        minHeight: "100vh",
        boxSizing: "border-box",
        marginTop: "2%",
      }}
    >
      <div
        className="back-to-info"
        style={{
          display: "inline-block",     // makes the div shrink to fit content
          width: "90%",                // match the iframe width
          maxWidth: "1200px",          // same as iframe max-width
          marginBottom: "1rem",        // space below the link
          textAlign: "left",           // align link to left edge of div/iframe
        }}
      >
        <Link
          to="/info"
          style={{
            color: "#000",             // black text
            textDecoration: "underline",
            fontWeight: "500",
            fontSize: "1rem",
          }}
        >
          ← More Information
        </Link>
      </div>


      {isMobile ? (
        <canvas
          ref={canvasRef}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />
      ) : (
        <iframe
          src={resumePDF}
          title="Resume"
          style={{
            width: isMobile ? "0" : "90%",   // hide iframe on mobile
            height: isMobile ? "0" : "90vh",
            border: "1px solid #ccc",
            borderRadius: "8px",
            maxWidth: "1200px",
            marginTop: "2rem",
            display: isMobile ? "none" : "block", // completely hide iframe on mobile
          }}
        />
      )}
    </main>
  );
};

export default ResumePage;
