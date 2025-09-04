// OtherExperiencesCarousel.jsx
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";
import { Link } from "react-router-dom";
import "../universal/OtherExperiencesCarousel.css";

const prettyName = (slug) =>
  slug.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

export default function OtherExperiencesCarousel({
  currentSlug,
  workOrder,
  logos,
  workMeta,
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
  {
    loop: true,            // <- wraps back to the start
    align: "start",
    dragFree: true,        // free glide
    skipSnaps: true,
    containScroll: "keepSnaps",
  },
  [
    AutoScroll({
      playOnInit: true,
      speed: 0.8,          // tweak 0.5–1.2
      stopOnMouseEnter: false,
      stopOnInteraction: false,
      // direction: "backward", // uncomment to drift right→left
    }),
    WheelGesturesPlugin({ forceWheelAxis: "x" }),
  ]
);

  // Respect reduced motion (stop autoscroll)
  React.useEffect(() => {
    if (!emblaApi) return;
    const auto = emblaApi.plugins()?.autoScroll;
    if (!auto) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => (mq.matches ? auto.stop() : auto.play());
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [emblaApi]);

  return (
    <div className="other-exp-shell">
      <div
        className="embla"
        ref={emblaRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Other experiences (auto-scrolling)"
      >
        <div className="embla__container">
          {workOrder.map((slug) => {
            const isCurrent = slug === currentSlug;
            const meta = workMeta[slug] || {};
            const Card = (
              <article
                className={`exp-card2 ${isCurrent ? "current-page" : ""}`}
                aria-current={isCurrent ? "page" : undefined}
              >
                <div className="exp-logo-wrap">
                  {logos[slug] ? (
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
                  <Link
                    className="exp-item2"
                    to={`/workexperience/${slug}`}
                    aria-label={prettyName(slug)}
                  >
                    {Card}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
