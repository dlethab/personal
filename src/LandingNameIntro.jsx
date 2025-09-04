// LandingNameIntro.jsx
import React, { useLayoutEffect, useRef, useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import "./LandingNameIntro.css";

// Binary-search fit to container width
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

export default function LandingNameIntro({
  first = "DLET",
  last = "HABTEMARIAM",
  duration = 1.2,
  ease = "power3.inOut",
  startDelay = 500,
  onDone,
  firstFillVH = 0.5,
  lastFillVH  = 0.5,
  // prop still allowed, but we'll override via location
  variant = "hero",
}) {
  const overlayRef = useRef(null);
  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);

  const headerWrapRef = useRef(null);
  const headerFirstRef = useRef(null);
  const headerLastRef = useRef(null);
  const headerFullRef = useRef(null); // single-node full name
  const coverRef = useRef(null);      // sliding curtain

  const location = useLocation();
  const isHome = location.pathname === "/";

  // Drive play/variant off the route
  const playOnMount = isHome;
  const effectiveVariant = isHome ? "hero" : "compact";

  // Start "running" only on home so overlay never shows on subpages
  const [running, setRunning] = useState(isHome);
  const [merged, setMerged] = useState(false);

  // Fit the two giant overlay lines to the viewport width
  const fitOverlayLines = useCallback(() => {
    const vw = window.innerWidth;
    fitExact(topLineRef.current, vw);
    fitExact(bottomLineRef.current, vw);
  }, []);

  const snapPx = (v) => {
    const dpr = window.devicePixelRatio || 1;
    return Math.round(v * dpr) / dpr;
  };

  // Fit the final header to the shell width (centered column safe)
  const fitHeaderFullWidth = useCallback(() => {
    const gutterPx = 0;
    const shell = headerWrapRef.current?.parentElement; // .name-header-shell
    const cw = (shell?.clientWidth ?? window.innerWidth) - gutterPx * 2;
    const containerWidth = Math.max(0, cw);
    fitExact(headerWrapRef.current, containerWidth, 10, 2000, gutterPx);
  }, []);

  const startAnimation = useCallback(() => {
    if (!overlayRef.current || !headerWrapRef.current) return;

    // Refit right before measuring
    fitOverlayLines();
    fitHeaderFullWidth();

    // Pick the content container to slide with the curtain
    const pageEl =
      document.querySelector(".page-reveal") ||
      document.querySelector("main") ||
      document.querySelector("#root main");

    // Measure FROM (overlay) and TO (header spans)
    const fromFirst = topLineRef.current.getBoundingClientRect();
    const fromLast = bottomLineRef.current.getBoundingClientRect();
    const toFirst = headerFirstRef.current.getBoundingClientRect();
    const toLast = headerLastRef.current.getBoundingClientRect();

    // Horizontal deltas
    const dxF = snapPx(toFirst.left - fromFirst.left);
    const dxL = snapPx(toLast.right - fromLast.right);
    const sxF = toFirst.width / Math.max(1, fromFirst.width);
    const sxL = toLast.width / Math.max(1, fromLast.width);

    // Vertical scale targets
    const syF = toFirst.height / Math.max(1, fromFirst.height);
    const syL = toLast.height / Math.max(1, fromLast.height);

    // Shared slide offset for title + page content
    const slideOffsetPx = 56; // tweak 32–72 to taste

    // ---------- Prep ----------
    gsap.set(topLineRef.current, {
      transformOrigin: "left center"
    });
    gsap.set(bottomLineRef.current, {
      transformOrigin: "right center"
    });

    // Header starts slightly DOWN so it can slide up later
    gsap.set(headerWrapRef.current, {
      opacity: 0,
      y: slideOffsetPx,
      pointerEvents: "none",
      transformOrigin: "center top",
    });

    // Overlay + curtain start at full viewport height
    gsap.set(overlayRef.current, {
      height: window.innerHeight,
      overflow: "hidden",
      zIndex: 50
    });
    gsap.set(coverRef.current, {
      height: window.innerHeight
    });

    // Page content starts down too
    if (pageEl) {
      gsap.set(pageEl, {
        y: slideOffsetPx
      });
      pageEl.style.willChange = "transform";
    }

    const hDur = 0.7;   // horizontal motion
    const vDur = 0.5;   // vertical join
    const lockDur = 0.45; // slide words to exact header Y
    const coverDur = 0.6; // curtain/overlay height shrink

    const tl = gsap.timeline({
      defaults: { ease },
      onComplete: () => {
        // cleanup frozen width and transforms
        if (headerWrapRef.current) headerWrapRef.current.style.width = "";
        if (pageEl) {
          pageEl.style.transform = "";
          pageEl.style.willChange = "";
        }
        fitHeaderFullWidth();
        setRunning(false);
        document.body.style.overflow = "";
        onDone && onDone();
      },
    });

    // ===== PHASE 1: Horizontal (x + scaleX)
    tl.to(topLineRef.current, { x: dxF, scaleX: sxF, duration: hDur }, 0)
      .to(bottomLineRef.current, { x: dxL, scaleX: sxL, duration: hDur }, 0)
      .add("hAligned");

    // Pivot to TOP so scaleY doesn't nudge the tops
    tl.add(() => {
      gsap.set(topLineRef.current, { transformOrigin: "left top" });
      gsap.set(bottomLineRef.current, { transformOrigin: "right top" });
    }, "hAligned");

    // ===== PHASE 2: Vertical to a shared baseline (y + scaleY)
    const meetY = Math.round((fromFirst.top + fromLast.top) / 2);
    const dyFmeet = snapPx(meetY - fromFirst.top);
    const dyLmeet = snapPx(meetY - fromLast.top);

    tl.to(topLineRef.current, { y: dyFmeet, scaleY: syF, duration: vDur }, "hAligned")
      .to(bottomLineRef.current, { y: dyLmeet, scaleY: syL, duration: vDur }, "hAligned")
      .add("joined");

    // ===== PHASE 3: Slide up and reveal (smoother)
    const dyFup = snapPx(toFirst.top - fromFirst.top);
    const dyLup = snapPx(toLast.top - fromLast.top);
    const finalOverlayH = toLast.bottom - window.innerHeight;

    // freeze header width to avoid reflow while it fades in
    const headerW = headerWrapRef.current.getBoundingClientRect().width;
    gsap.set(headerWrapRef.current, { width: headerW });

    // prep: enable GPU + will-change on moving pieces
    gsap.set([topLineRef.current, bottomLineRef.current, headerWrapRef.current], {
      force3D: true,
      willChange: "transform, filter, opacity"
    });

// use a slightly longer, softer ease for the vertical lock
const upEase = "power2.inOut";
const upDur = Math.max(0.55, lockDur); // a touch longer feels silkier

tl
  // lines slide to the header's final Y (start at the SAME label)
  .to(topLineRef.current, {
    y: dyFup,
    duration: upDur,
    ease: upEase,
    autoRound: false,
    // subtle motion blur that fades out
    filter: "blur(1.1px)",
  }, "joined")
  .to(bottomLineRef.current, {
    y: dyLup,
    duration: upDur,
    ease: upEase,
    autoRound: false,
    filter: "blur(1.1px)",
  }, "joined")
  // remove the blur near the end so it doesn't linger
  .to([topLineRef.current, bottomLineRef.current], {
    filter: "blur(0px)",
    duration: 0.18,
    ease: "power1.out",
  }, `joined+=${upDur - 0.18}`)

  // curtain rise in sync (not earlier)
  .to(coverRef.current, {
    height: finalOverlayH,
    duration: coverDur,
    ease: "power2.inOut",
    autoRound: false,
  }, "joined")

  // header + page glide up together, in sync
  .to(headerWrapRef.current, {
    y: 0,
    opacity: 1,
    pointerEvents: "auto",
    duration: coverDur,
    ease: "power2.inOut",
    autoRound: false,
  }, "joined")
  .to(pageEl, {
    y: 0,
    duration: coverDur,
    ease: "power2.inOut",
    autoRound: false,
  }, "joined");

  }, [fitOverlayLines, fitHeaderFullWidth, ease, onDone]);

  // Mount effect: lock scroll, fit sizes, handle resize & start after delay
  useLayoutEffect(() => {
    if (running) document.body.style.overflow = "hidden";

    fitOverlayLines();
    fitHeaderFullWidth();

    const onResize = () => {
      if (running) fitOverlayLines();
      fitHeaderFullWidth();
    };
    window.addEventListener("resize", onResize);

    let id;
    if (playOnMount) {
      id = setTimeout(startAnimation, startDelay);
    } else {
      // No intro? render header immediately in single-node form
      setMerged(true);
      setRunning(false); // ensure overlay doesn't render on subpages
      if (headerFullRef.current) headerFullRef.current.style.display = "inline";
      if (headerFirstRef.current) headerFirstRef.current.style.display = "none";
      if (headerLastRef.current)  headerLastRef.current.style.display  = "none";
      gsap.set(headerWrapRef.current, { opacity: 1, y: 0, pointerEvents: "auto" });
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => fitHeaderFullWidth());
    }

    return () => {
      if (id) clearTimeout(id);
      window.removeEventListener("resize", onResize);
      if (running) document.body.style.overflow = "";
    };
  }, [playOnMount, running, startDelay, startAnimation, fitOverlayLines, fitHeaderFullWidth, isHome]);

  // Drive persistent size between routes
  useEffect(() => {
    if (!headerWrapRef.current) return;
    const targetScale = effectiveVariant === "hero" ? 1 : 0.40; // tweak to taste
    gsap.to(headerWrapRef.current, {
      scale: targetScale,
      transformOrigin: "center top",
      duration: 0.6,
      ease: "power3.inOut",
    });
  }, [effectiveVariant]);

  const fullName = `${first} ${last}`;

  return (
    <>
      {/* Final, persistent header (ONE element after merge) */}
      <div className="name-header-shell">
        <h1
          className="page-title name-header"
          ref={headerWrapRef}
          aria-label={fullName}
        >
          {/* These two are only used for measuring during the intro; hidden afterward */}
          <span
            ref={headerFirstRef}
            style={{ display: merged ? "none" : "inline" }}
          >
            {first}
          </span>{" "}
          <span
            ref={headerLastRef}
            style={{ display: merged ? "none" : "inline" }}
          >
            {last}
          </span>

          {/* This is the single, persistent node */}
          <span
            ref={headerFullRef}
            className="name-header-full"
            style={{ display: merged ? "inline" : "none" }}
          >
            {fullName}
          </span>
        </h1>
      </div>

      {/* Fullscreen overlay (visible while running) */}
      {running && isHome && (
        <div className="name-intro-overlay" ref={overlayRef}>
          {/* sliding background curtain (shrinks to header height) */}
          <div className="name-intro-cover" ref={coverRef} />

          <div className="name-intro-line name-intro-line--top">
            <span ref={topLineRef} className="name-intro-text">{first}</span>
          </div>
          <div className="name-intro-line name-intro-line--bottom">
            <span ref={bottomLineRef} className="name-intro-text">{last}</span>
          </div>
        </div>
      )}
    </>
  );
}
