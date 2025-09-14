import React, { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom"
import "./InfoPage.css";

import img1 from "../assets/photos/personal.png";
import img2 from "../assets/photos/art/hugo/hugo.png";
import img3 from "../assets/dlet.png";


/** Reveal-on-scroll wrapper */
function Reveal({ as: Tag = "div", className = "", children }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect OS reduced-motion
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      node.classList.add("show");
      return;
    }

    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("show");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}

export default function InfoPage() {
  const gallery = useMemo(() => [img2, img3], []);

  const aboutText =
    "dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam dlet habtemariam ";

  return (
    <main className="page" aria-label="Information">
      {/* HERO / ABOUT */}
      <section className="section hero">
        <div className="grid-2">
          <Reveal as="figure" className="img-wrap">
            <img src={img1} alt="Portrait of Dlet Habtemariam" loading="eager" />
          </Reveal>

          <Reveal as="div" className="hero-text">
            <h1 className="title">Information</h1>
            <p className="lead">{aboutText}</p>
            <div className="cta-row">
                <Link to="/resume" className="btn">
                  View Resume
                </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOBBIES / INTERESTS */}
      <section className="section">
        <div className="grid-2">
          <Reveal as="div">
            <h2 className="h2">Hobbies & Interests</h2>
            <p className="body">
              I love building small tools, exploring design, and learning by shipping. Off-screen:
              long walks, pilates, and the occasional clay modeling session. I’m also big on
              community—mentoring and running engaging, creative events.
            </p>
            <ul className="bullets">
              <li>Weekend mini-projects & content experiments</li>
              <li>Reading lists & note-taking systems</li>
              <li>Pilates / 10k+ steps most days</li>
              <li>Trying new solo activities and documenting them</li>
            </ul>
          </Reveal>

          <Reveal as="div">
            <div className="gallery">
              {gallery.map((src, i) => (
                <figure key={i} className="img-wrap">
                  <img src={src} alt={`Gallery image ${i + 1}`} loading="lazy" />
                </figure>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ORGANIZATIONS / AFFILIATIONS */}
      <section className="section">
        <Reveal as="div">
          <h2 className="h2">Organizations & Affiliations</h2>
          <p className="body">
            Active in NSBE (chapter leadership, programs, workshops, mentoring) and involved in
            campus/community events that connect students to opportunities.
          </p>
          <ul className="bullets">
            <li>NSBE — Executive Board leadership & programs</li>
            <li>Workshop facilitation, interview prep, study nights</li>
            <li>Conference planning & sponsorship outreach</li>
          </ul>
        </Reveal>
      </section>
    </main>
  );
}
