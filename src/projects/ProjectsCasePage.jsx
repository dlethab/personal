// ProjectsCasePage.jsx
import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import "../universal/OtherExperiencesCarousel.css"; // reuse same CSS

import OtherProjectsCarousel from "./OtherProjectsCarousel";
import { projectOrder, projectMeta } from "./ProjectData";
import InteractiveSitePreview from "./InteractiveSitePreview";

// Optional logos (put files in src/assets/project-logos/)
import dialinLogo from "../assets/logos/dialinlogo.png";
import utdnsbeLogo from "../assets/logos/utdnsbelogo.png";

const projectLogos = {
  "dial-in": dialinLogo,
  "UTD-NSBE": utdnsbeLogo,

  "portfolio-site": dialinLogo,
  "algo-visualizer": utdnsbeLogo,
};

const prettyName = (slug) =>
  slug.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

export default function ProjectsCasePage() {
  const { project } = useParams();

  if (!projectOrder.includes(project)) {
    return <Navigate to={`/projects/${projectOrder[0]}`} replace />;
  }

  const idx  = projectOrder.indexOf(project);
  const prev = idx > 0 ? projectOrder[idx - 1] : null;
  const next = idx < projectOrder.length - 1 ? projectOrder[idx + 1] : null;

  const meta = projectMeta[project] || {};
  const titlePretty = meta.displayName || prettyName(project);

  return (
    <main className="case-wrap">
      {/* Header */}
      <header className="case-header">
        <div className="case-breadcrumb">
          <Link to="/" className="crumb">Home</Link>
          <span className="crumb-sep">/</span>
          <Link to={`/projects/${projectOrder[0]}`} className="crumb">Technical Projects</Link>
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
              <span className="meta-label">Tenure</span>
              <span className="meta-value">{meta.dates}</span>
            </div>
          )}
          {meta.location && (
            <div className="meta-chip">
              <span className="meta-label">Location</span>
              <span className="meta-value">{meta.location}</span>
            </div>
          )}
          {meta.team && (
            <div className="meta-chip">
              <span className="meta-label">Team</span>
              <span className="meta-value">{meta.team}</span>
            </div>
          )}
          {meta.links?.live && (
            <a className="meta-chip home-link" href={meta.links.live} target="_blank" rel="noreferrer">
              <span className="meta-label">Live</span>
              <span className="meta-value">{new URL(meta.links.live).hostname}</span>
            </a>
          )}
          {meta.links?.repo && (
            <a className="meta-chip home-link" href={meta.links.repo} target="_blank" rel="noreferrer">
              <span className="meta-label">Code</span>
              <span className="meta-value">GitHub</span>
            </a>
          )}
        </div>
      </header>

        {/* Detail blocks */}
        <section className="case-details">
        {/* Live Preview (if site allows embedding) */}
        {meta.links?.live && (
            <div className="detail-block">
            <div className="detail-divider" />
            <h2 className="detail-title">Live Preview</h2>
            <InteractiveSitePreview
                url={meta.links.live}
                title={meta.displayName || meta.title || "Live preview"}
                ratio={16 / 10}    // adjust if you want taller/shorter
                heightMin={460}    // ensures decent height on narrow screens
            />
            </div>
        )}

        {/* Overview */}
        <div className="detail-block">
            <div className="detail-divider" />
            <h2 className="detail-title">Overview</h2>
            <p className="detail-body">
            {meta.overview ||
                "Project summary—scope, problems solved, approach taken, and outcomes."}
            </p>
        </div>

        {/* Skills */}
        {!!meta.skills?.length && (
            <div className="detail-block">
            <div className="detail-divider" />
            <h2 className="detail-title">Skills</h2>
            <div className="case-meta" aria-label="Skills used">
                {meta.skills.map((s) => (
                <div className="meta-chip" key={s}>
                    <span className="meta-value">{s}</span>
                </div>
                ))}
            </div>
            </div>
        )}
        </section>

        {/* Other Projects (carousel) */}
        <section className="other-exp-section" aria-label="Other projects">
          <h3 className="other-exp-heading">Other Projects</h3>
            <OtherProjectsCarousel
              currentSlug={project}
              projectOrder={projectOrder}
              projectMeta={projectMeta}
              logos={projectLogos}       // optional
            />
        </section>



      {/* Pager */}
      <nav className="case-pager" aria-label="Other projects">
        {prev ? (
          <Link className="pager-link prev" to={`/projects/${prev}`}>
            ← {projectMeta[prev]?.displayName || prettyName(prev)}
          </Link>
        ) : <span />}
        {next ? (
          <Link className="pager-link next" to={`/projects/${next}`}>
            {projectMeta[next]?.displayName || prettyName(next)} →
          </Link>
        ) : <span />}
      </nav>
    </main>
  );
}
