import React from "react";
import "./InteractiveSitePreview.css";

export default function InteractiveSitePreview({
  url,
  title = "Live preview",
  ratio = 16 / 10,           // width / height
  heightMin = 420,
  blockedTimeoutMs = 3000,   // if not loaded by then, show “blocked?” note
}) {
  const [loaded, setLoaded] = React.useState(false);
  const [key, setKey] = React.useState(0); // force remount on reload
  const [maybeBlocked, setMaybeBlocked] = React.useState(false);
  const frameRef = React.useRef(null);
  const wrapRef = React.useRef(null);

  React.useEffect(() => {
    setLoaded(false);
    setMaybeBlocked(false);
    const id = setTimeout(() => {
      if (!loaded) setMaybeBlocked(true);
    }, blockedTimeoutMs);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, key]);

  const domain = (() => {
    try { return new URL(url).hostname.replace(/^www\./, ""); }
    catch { return url; }
  })();

  const onReload = () => setKey((k) => k + 1);
  const onFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  return (
    <section className="live-frame-section">
      <div className="live-frame-toolbar">
        <div className="live-frame-meta">
          <span className="live-dot" aria-hidden="true" />
          <span className="live-domain" title={url}>{domain}</span>
        </div>
        <div className="live-frame-actions">
          <button className="live-btn" onClick={onReload} aria-label="Reload">↻</button>
          <button className="live-btn" onClick={onFullscreen} aria-label="Fullscreen">⤢</button>
          <a className="live-btn live-open" href={url} target="_blank" rel="noreferrer">Open</a>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="live-frame-wrap"
        style={{
          // maintain ratio but never shorter than min
          minHeight: `${heightMin}px`,
          aspectRatio: `${ratio}`,
        }}
      >
        {!loaded && (
          <div className="live-frame-skel" aria-hidden="true">
            <div className="bar" /><div className="bar" /><div className="bar" />
          </div>
        )}

        <iframe
          key={key}
          ref={frameRef}
          className={`live-iframe ${loaded ? "is-loaded" : ""}`}
          title={title}
          src={url}
          loading="lazy"
          // sandbox & allow tuned for typical app interactivity
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          allow="clipboard-write; fullscreen"
          onLoad={() => setLoaded(true)}
        />

        {maybeBlocked && !loaded && (
          <div className="live-blocked">
            <p>
              This site blocks embedding (<code>X-Frame-Options</code> / <code>frame-ancestors</code>).
              Use <a href={url} target="_blank" rel="noreferrer">Open</a> to view it.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
