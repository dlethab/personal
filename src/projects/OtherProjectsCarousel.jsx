// OtherProjectsCarousel.jsx
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";
import { Link } from "react-router-dom";
import "../universal/OtherExperiencesCarousel.css"; // reuse same CSS

const prettyName = (slug) =>
  slug.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

export default function OtherProjectsCarousel({
  currentSlug,
  projectOrder,
  logos,
  projectMeta,
}) {
  const list = Array.isArray(projectOrder) ? projectOrder.filter(Boolean) : [];

  // Embla options
  const options = {
    loop: true,
    align: "start",
    dragFree: true,
    skipSnaps: true,
    containScroll: "keepSnaps",
  };

  // Only add plugins if we have 2+ slides
  const plugins =
    list.length >= 2
      ? [
          AutoScroll({
            playOnInit: true,
            speed: 0.8,
            stopOnMouseEnter: false,
            stopOnInteraction: false,
          }),
          WheelGesturesPlugin({ forceWheelAxis: "x" }),
        ]
      : [];

  // IMPORTANT: attach ref to the VIEWPORT element
  const [viewportRef, emblaApi] = useEmblaCarousel(options, plugins);

  // Respect reduced motion and reInit
  React.useEffect(() => {
    if (!emblaApi) return;
    const auto = emblaApi.plugins()?.autoScroll;
    if (!auto) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (mq.matches || list.length < 2) auto.stop();
      else auto.play();
    };

    apply();
    emblaApi.on("reInit", apply);
    mq.addEventListener("change", apply);

    return () => {
      try { auto.stop(); } catch {}
      try { emblaApi.off("reInit", apply); } catch {}
      mq.removeEventListener("change", apply);
    };
  }, [emblaApi, list.length]);

  if (list.length === 0) return null;

  return (
    <div className="other-exp-shell">
      <div
        className="embla"
        role="region"
        aria-roledescription="carousel"
        aria-label="Other projects (auto-scrolling)"
      >
        <div className="embla__viewport" ref={viewportRef}>
          <div className="embla__container">
            {list.map((slug) => {
              const isCurrent = slug === currentSlug;
              const meta = (projectMeta && projectMeta[slug]) || {};
              const Card = (
                <article
                  className={`exp-card2 ${isCurrent ? "current-page" : ""}`}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  <div className="exp-logo-wrap">
                    {logos && logos[slug] ? (
                      <img src={logos[slug]} alt={`${prettyName(slug)} logo`} />
                    ) : (
                      <div className="logo-fallback" aria-hidden="true">X</div>
                    )}
                  </div>
                  <div className="exp-text">
                    <h4 className="exp-company">{prettyName(slug)}</h4>
                    <div className="exp-meta-line">
                      <span className="exp-title">{meta.title || "Title"}</span>
                    </div>
                    <div className="exp-meta-sub">
                      <span>{meta.dates || "Dates"}</span>
                      <span className="dot">•</span>
                      <span>{meta.location || "Location"}</span>
                    </div>
                  </div>
                </article>
              );

              return (
                <div className="embla__slide" key={slug}>
                  {isCurrent ? (
                    <div className="exp-item2">{Card}</div>
                  ) : (
                    <Link className="exp-item2" to={`/projects/${slug}`} aria-label={prettyName(slug)}>
                      {Card}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
