
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";
import { Link } from "react-router-dom";
import "./OtherArtCarousel.css";

const prettyName = (slug) =>
  slug.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

export default function OtherArtCarousel({
  currentSlug,
  artOrder,
  logos,
  artMeta,
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
      speed: 0.8,          // .8
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
    <div className="art-other-exp-shell">
      <div
        className="embla"
        ref={emblaRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Other Art (auto-scrolling)"
      >
        <div className="art-embla__container">
          {artOrder.map((slug) => {
            const isCurrent = slug === currentSlug;
            const meta = artMeta[slug] || {};
            const Card = (
              <article
                className={`art-exp-card2 ${isCurrent ? "current-page" : ""}`}
                aria-current={isCurrent ? "page" : undefined}
              >
                <div className="art-exp-logo-wrap">
                  {logos[slug] ? (
                    <img src={logos[slug]} alt={`${prettyName(slug)} logo`} />
                  ) : (
                    <div className="art-logo-fallback" aria-hidden="true">X</div>
                  )}
                </div>
                <div className="art-exp-text">
                  <h4 className="art-exp-company">{meta.title}</h4>
                  <div className="art-exp-meta-sub">
                    <span>{meta.dates || "Dates"}</span>
                  </div>
                </div>
              </article>
            );

            return (
              <div className="art-embla__slide" key={slug}>
                {isCurrent ? (
                  <div className="art-exp-item2">{Card}</div>
                ) : (
                  <Link
                    className="art-exp-item2"
                    to={`/artdesign/${slug}`}
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
