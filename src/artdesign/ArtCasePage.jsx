import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import "../universal/OtherExperiencesCarousel.css";
import OtherArtCarousel from "./OtherArtCarousel.jsx";
import { artOrder } from "./ArtData.js";


import CompanyCollageStack from "../work/CompanyCollageStack.jsx"; // Import Collage Component
import "../work/CompanyCollageStack.css"; // Import Collage CSS

import blentable from "../assets/logos/blentablelogo.png";
import smoking from "../assets/logos/chairlogo.png";
import hugologo from "../assets/logos/hugologo.png";


const logos = {
  blentable: blentable,
  smoking: smoking,
  hugo: hugologo
};

export const artMeta = {
  "blentable": {
    title: "Blen's Table",
    dates: "August 2025",
    blurb: "Table for record player, records, and books",
    overview: "Little sister wanted table. So we made table",
  },
  "smoker": {
    title: "smoker",
    dates: "Date Unknown",
    blurb: "Smoker boy",
    overview: "oil pastels on paper",
  },
  "hugo": {
    title: "Hugo",
    dates: "Date Unknown",
    blurb: "chipmunk",
    overview: "Followed a nature drawing book for this",
  },
  "dresser": {
    title: "Dresser",
    dates: "Present",
    blurb: "Under Construction",
    overview: "Under construction",
  },
  
};



function importAllFromPhotos() {
  const ctx = require.context("../assets/photos/art", true, /\.(avif|webp|png|jpe?g|gif)$/i);
  const acc = {};
  const toSlug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  ctx.keys().forEach((k) => {
    // k e.g. "./chartbeat/01.jpg"
    const m = k.match(/^\.\/([^/]+)\//);
    if (!m) return;
    const slug = toSlug(m[1]);
    (acc[slug] ??= []).push({ url: ctx(k), path: k.toLowerCase() });
  });
  for (const slug in acc) {
    acc[slug].sort((a, b) => a.path.localeCompare(b.path));
    acc[slug] = acc[slug].map((x) => x.url);
  }
  return acc;
}
const imagesByProject = importAllFromPhotos();

const prettyName = (slug) =>
  slug.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

export default function ArtCasePage() {
  const { piece } = useParams();

  // If data isn't ready or empty, render a friendly message
  if (!Array.isArray(artOrder) || artOrder.length === 0) {
    return <main className="case-wrap" style={{ padding: 24 }}>No art pieces configured in <code>ArtData.js</code>.</main>;
  }

  // Redirect to first if slug invalid/missing
  if (!piece || !artOrder.includes(piece)) {
    return <Navigate to={`/artdesign/${artOrder[0]}`} replace />;
  }

  const idx = artOrder.indexOf(piece);
  const prev = idx > 0 ? artOrder[idx - 1] : null;
  const next = idx < artOrder.length - 1 ? artOrder[idx + 1] : null;

  const meta = artMeta[piece] || {};
  const titlePretty = meta.title || prettyName(piece);

  return (
    <main className="case-wrap">

      {/* Add Company Collage Stack for the specific project */}
      <section className="company-collage">
        <CompanyCollageStack
          company={piece} // Dynamically set to the current art piece
          imagesByCompany={imagesByProject}
          logos={logos}
          height={380} // Height of the collage stage
          bounds={{ minW: 200, maxW: 500, minH: 150, maxH: 400 }} // Bounds for image sizes
          maxLayers={30} // Max layers of photos to stack
          baseIndex={0} // Index of the base photo
          fixedBase={true} // Whether to keep the base fixed
          includeBaseInCycle={false} // Whether the base should be cycled with the images
          baseScale={0.8} // Scaling of the base image
        />
      </section>

      {/* Header */}
      <header className="case-header">
        <div className="case-breadcrumb">
          <Link to="/" className="crumb">Home</Link>
          <span className="crumb-sep">/</span>
          <Link to={`/artdesign/${artOrder[0]}`} className="crumb">Art & Design</Link>
          <span className="crumb-sep">/</span>
          <span className="crumb current">{titlePretty}</span>
        </div>

        <h1 className="case-title">{titlePretty}</h1>

        <p className="case-subtitle">
          {meta.title && <em>{meta.title}</em>}
          {meta.blurb && <> — {meta.blurb}</>}
        </p>

        <div className="case-meta">
          {meta.dates && (
            <div className="meta-chip">
              <span className="meta-label">Year</span>
              <span className="meta-value">{meta.dates}</span>
            </div>
          )}
        </div>
      </header>

      {/* Details */}
      <section className="case-details">
        <div className="detail-block">
          <div className="detail-divider" />
          <h2 className="detail-title">Overview</h2>
          <p className="detail-body">
            {meta.overview || "Add an overview in ArtData.js under this slug’s entry."}
          </p>
        </div>
      </section>

      {/* Other Art (carousel) */}
      <section className="other-exp-section" aria-label="Other works">
        <h3 className="other-exp-heading">Other Works</h3>
        <OtherArtCarousel
          currentSlug={piece}
          artOrder={artOrder}
          logos={logos}
          artMeta={artMeta}
          basePath="/artdesign"
        />
      </section>
      

      {/* Pager */}
      <nav className="case-pager" aria-label="Other works">
        {prev ? (
          <Link className="pager-link prev" to={`/artdesign/${prev}`}>
            ← {artMeta[prev]?.title || prettyName(prev)}
          </Link>
        ) : <span />}

        {next ? (
          <Link className="pager-link next" to={`/artdesign/${next}`}>
            {artMeta[next]?.title || prettyName(next)} →
          </Link>
        ) : <span />}
      </nav>
    </main>
  );
}
