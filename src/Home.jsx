import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ContactOverlay from "./ContactOverlay";
import spiderImage from "./assets/spider.png";
import tigerImage from "./assets/tiger.png";

function fitExact(el, containerWidth, minPx = 6, maxPx = 1000, pad = 1) {
  if (!el || !containerWidth) return;
  el.style.whiteSpace = "nowrap";
  el.style.display = "inline-block";
  let lo = minPx, hi = maxPx, best = minPx;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    el.style.fontSize = `${mid}px`;
    const w = el.scrollWidth;
    if (w <= containerWidth - pad) { best = mid; lo = mid + 1; }
    else { hi = mid - 1; }
  }
  el.style.fontSize = `${best}px`;
}

export default function Home() {
  const [menuStage, setMenuStage] = useState("closed"); // 'closed' | 'opening' | 'open' | 'closing'
  const closeTimeout = useRef(null);
  const isOpenish = menuStage !== "closed";

  const [isOpen, setIsOpen] = useState(false);

  // Function to open the popup
  const handleContactClick = () => {
    setIsOpen(true); // Set to true to trigger the popup open
    closeMenu()
  };

  // Function to close the popup
  const closePopup = () => {
    setIsOpen(false); // Set to false to trigger the popup close
  };


  const openMenu = () => {
    console.log("Opening menu...");
    if (closeTimeout.current) { clearTimeout(closeTimeout.current); closeTimeout.current = null; }
    setMenuStage("opening");
    requestAnimationFrame(() => requestAnimationFrame(() => setMenuStage("open")));
  };

  const closeMenu = () => {
    console.log("Closing menu...");
    setMenuStage("closing");
    closeTimeout.current = setTimeout(() => {
      setMenuStage("closed");
      closeTimeout.current = null;
    }, 400 + 240 + 50);
  };

  useEffect(() => {
    console.log("useEffect triggered");
    const adjustAll = () => {
      const w = window.innerWidth;
      console.log("Adjusting text size for width:", w);
      document.querySelectorAll(".big-text-heading").forEach((el) => {
        el.style.fontSize = "100px"; // temp
        fitExact(el, w);
      });
    };
    adjustAll();
    window.addEventListener("resize", adjustAll);
    if (document.fonts?.ready) document.fonts.ready.then(adjustAll).catch(() => {});
    return () => {
      console.log("Cleanup in useEffect");
      window.removeEventListener("resize", adjustAll);
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  return (
    <>
      <ContactOverlay isOpen={isOpen} closePopup={closePopup} />
      {/* Debugging: Check if the overlay is open */}
      <div style={{ marginTop: "10rem" }}>
        <div className="big-text">
          <Link to="/workexperience/chartbeat" title="Work Experience">
            <img src={spiderImage} alt="Spider" className="big-text-image" />
            <h1 className="big-text-heading">WORK EXPERIENCE</h1>
          </Link>
        </div>

        {/* Other links */}
        <div className="big-text">
          <Link to="/projects/dial-in" title="Projects">
            <img src={tigerImage} alt="Tiger" className="big-text-image" />
            <h1 className="big-text-heading">TECHNICAL PROJECTS</h1>
          </Link>
        </div>

        {/* Other links */}
        <div className="big-text">
          <Link to="/artdesign/poster-series" title="Art & Design">
            <img src={spiderImage} alt="art" className="big-text-image" />
            <h1 className="big-text-heading">ART & DESIGN</h1>
          </Link>
        </div>

        {/* Menu Button for opening Contact */}
        {!isOpenish && (
          <button
            className="fab-plus"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={false}
            onClick={openMenu}
          >
            +
          </button>
        )}

        {isOpenish && (
          <nav
            className={`overlay-menu ${menuStage}`}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <ul className="menu-list">
              <li><Link to="#" onClick={handleContactClick}>CONTACT</Link></li>
              <li><Link to="/workexperience/chartbeat">WORK EXPERIENCE</Link></li>
              <li><Link to="/projects/dial-in">TECHNICAL PROJECTS</Link></li>
              <li><Link to="/info">INFORMATION</Link></li>
            </ul>


            <button
              className={`fab-plus ${menuStage === "open" ? "open" : ""}`}
              onClick={menuStage === "open" ? closeMenu : openMenu}
              aria-label="Toggle menu"
              aria-expanded={menuStage === "open"}
            >
              +
            </button>
          </nav>
        )}
      </div>
    </>
  );
}
