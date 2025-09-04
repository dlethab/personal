// CompanyCasePage.jsx
import React, { useEffect, useRef} from "react";
import { useParams, Link } from "react-router-dom";
import { workOrder } from "./WorkData";
import "./CompanyCasePage.css";

import OtherExperiencesCarousel from "./OtherExperiencesCarousel.jsx";
import CompanyCollageStack from "./CompanyCollageStack.jsx";

import chartbeatLogo from "../assets/logos/chartbeat.png";
import ericssonLogo from "../assets/logos/ericsson.png";
import thermoLogo from "../assets/logos/thermo.png";
import davacoLogo from "../assets/logos/davaco.png";

// Map slugs -> logo assets (keys must match slugs in workOrder)
const logos = {
  chartbeat: chartbeatLogo,
  ericsson: ericssonLogo,
  "Thermo Fisher Scientific": thermoLogo,
  davaco: davacoLogo,
};


const prettyName = (slug) =>
  slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

// Minimal meta for cards — fill these in with your real data
const workMeta = {
  chartbeat: {
    title: "Software Engineering Intern",
    dates: "Summer 2024",
    location: "New York, NY",
    team: "Core Product",
    blurb: "Shipped analytics tooling and performance dashboards for editors.",
    overview:
      "Built and shipped features for real-time editorial analytics. Focused on performance profiling, React component refactors, and instrumenting metrics that improved dashboard load times and insight accuracy.",
    skills: [
    "Python",
    "REST APIs",
    "Kafka (streaming)",
    "Real-time data processing",
    "Web scraping / content extraction",
    "Session & auth handling (HTTP/cookies)",
    "Observability",
    "Grafana (dashboards)",
    "Nagios (alerts)",
    "Performance profiling",
    "Data pipelines",
    "Unit & integration testing",
    "Agile & code reviews",
    "Git",
    "Bash/Shell"
    ]
  },
  ericsson: {
    title: "Integrations Engineer Intern",
    dates: "May 2023 - Dec 2023",
    location: "Plano, TX",
    team: "OSS & Transformation",
    blurb: "Automated OSS integrations and deployment workflows.",
    overview:
      "Developed automation for OSS integrations, reducing manual deployment steps and errors across environments. Authored CI/CD scripts and service health checks used by the team during rollouts.",
    skills: [
      "GitLab CI/CD",
      "Docker",
      "Kubernetes",
      "Helm",
      "Allure (test reporting)",
      "QA automation frameworks",
      "Microservices",
      "Event-driven architecture",
      "Kafka (messaging)",
      "PostgreSQL",
      "Integration testing",
      "Monitoring/observability",
      "Bash/Shell scripting",
      "Git",
      "Agile & code reviews",
      "Technical documentation"
    ]
  },
  "Thermo Fisher Scientific": {
    title: "Automation Intern",
    dates: "Summer 2022",
    location: "Carlsbad, CA",
    team: "Automation",
    blurb: "Built lab automation scripts and pipeline monitoring.",
    overview:
      "Prototyped lab automation scripts and monitoring for sample pipelines. Delivered reliability fixes and small tools that improved throughput and traceability for bench workflows.",
    skills: [
      "Python",
      "SQL",
      "ETL automation",
      "Reporting pipelines",
      "Celonis (process mining)",
      "Data analysis & visualization",
      "KPI design & tracking",
      "Process optimization",
      "Scheduling/cron",
      "Stakeholder communication",
      "Unit testing",
      "Version control (Git)"
    ]
  },
  davaco: {
    title: "Software Engineering Intern",
    dates: "Feb 2021 – May 2022",
    location: "Dallas, TX",
    team: "Engineering",
    blurb: "Developed internal tools to support multi-site retail rollouts.",
    overview:
      "Created internal web tools and scripts to coordinate multi-site deployments. Streamlined status tracking and reduced turnaround time for field teams via small UX improvements and data automation.",
    skills: [
      "SQL",
      "Data warehousing",
      "Data modeling",
      "ETL workflows",
      "Power BI (dashboards)",
      "SSRS migration",
      "Reporting & analytics",
      "Data validation & reliability",
      "Query performance tuning",
      "Scheduling/automation",
      "Stakeholder collaboration",
      "Documentation",
      "Version control (Git)"
    ]
  },
};

// Auto-load all images under ./assets/photos/<slug>/*.(png|jpg|jpeg|webp|gif|avif)
function importAllFromPhotos() {
  const ctx = require.context("../assets/photos", true, /\.(avif|webp|png|jpe?g|gif)$/i);
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
const imagesByCompany = importAllFromPhotos();



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


export default function CompanyCasePage() {
  const { company } = useParams();
  const meta = workMeta[company] || {};


  // Find index safely
  const idx = workOrder.indexOf(company);
  const prev = idx > 0 ? workOrder[idx - 1] : null;
  const next = idx >= 0 && idx < workOrder.length - 1 ? workOrder[idx + 1] : null;

  const companyPretty = prettyName(company);

  const closeTimeout = useRef(null);


  useEffect(() => {
    const adjustAll = () => {
      const screenWidth = window.innerWidth;
      document.querySelectorAll(".big-text-heading, .page-title").forEach(text => {
        text.style.fontSize = "100px";
        fitExact(text, screenWidth);
      });
    };

    adjustAll();
    window.addEventListener("resize", adjustAll);

    if (document.fonts?.ready) {
      document.fonts.ready
        .then(adjustAll)
        .catch(() => {});
    }

    return () => {
      window.removeEventListener("resize", adjustAll);
    };
  }, [closeTimeout]);


  return (
    <main className="case-wrap">

      <div className="collage-stage-wrap">
        <CompanyCollageStack
          company={company}
          logos={logos}
          imagesByCompany={imagesByCompany}
          height={380}
          bounds={{ minW: 180, maxW: 520, minH: 140, maxH: 340 }}
          maxLayers={28}
        />
      </div>

            {/* Pager */}
      <nav className="case-pager" aria-label="Other companies">
        {prev ? (
          <Link className="pager-link prev" to={`/workexperience/${prev}`}>
            ← {prettyName(prev)}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="pager-link next" to={`/workexperience/${next}`}>
            {prettyName(next)} →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      {/* Header */}
      <header className="case-header">
        <div className="case-breadcrumb">
          <Link to="/" className="crumb">Home</Link>
          <span className="crumb-sep">/</span>
          <Link to="/workexperience/chartbeat" className="crumb">Work Experience</Link>
          <span className="crumb-sep">/</span>
          <span className="crumb current">{companyPretty}</span>
        </div>

        <h1 className="case-title">{companyPretty}</h1>

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
        </div>
      </header>

      {/* Detail blocks */}
      <section className="case-details">
        <div className="detail-block">
          <div className="detail-divider" />
          <h2 className="detail-title">Overview</h2>
          <p className="detail-body">
            {meta.overview ||
              "Recap your time here—your scope, the problems you owned, and what outcomes you drove."}
          </p>
        </div>


        {/* Skills */}
        {Array.isArray(meta.skills) && meta.skills.length > 0 && (
          <div className="detail-block">
            <div className="detail-divider" />
            <h2 className="detail-title">Skills</h2>

            {/* Reuse your chip style */}
            <div className="case-meta skills-meta" role="list">
              {meta.skills.map((skill) => (
                <div className="meta-chip skill-chip" role="listitem" key={skill}>
                  <span className="meta-value">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>




      {/* Other Experiences (continuous carousel) */}
      <section className="other-exp-section" aria-label="Other experiences">
        <h3 className="other-exp-heading">Other Experiences</h3>
        <OtherExperiencesCarousel
          currentSlug={company}
          workOrder={workOrder}
          logos={logos}
          workMeta={workMeta}
          basePath="/workexperience"
        />
      </section>

      {/* Pager */}
      <nav className="case-pager" aria-label="Other companies">
        {prev ? (
          <Link className="pager-link prev" to={`/workexperience/${prev}`}>
            ← {prettyName(prev)}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="pager-link next" to={`/workexperience/${next}`}>
            {prettyName(next)} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
