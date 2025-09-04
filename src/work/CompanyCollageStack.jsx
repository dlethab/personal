// CompanyCollageStack.jsx
import React from "react";
import "./CompanyCollageStack.css";

const toSlug = (s) =>
  String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * Props:
 *  - company: string (slug)
 *  - imagesByCompany: { [slug]: string[] }
 *  - logos: { [slug]: string }
 *  - height?: number | string                // fixed stage height (e.g. 380 or "40vh")
 *  - bounds?: { minW, maxW, minH, maxH }     // random size limits
 *  - maxLayers?: number                      // cap stacked layers (default 24)
 *  - fixedBase?: boolean                     // keep first photo fixed (default true)
 *  - baseIndex?: number                      // which photo is the fixed one (default 0)
 *  - includeBaseInCycle?: boolean            // also cycle the base image on top? (default false)
 *  - base?: { w, h, left, top }              // optional explicit base geometry
 */
export default function CompanyCollageStack({
  company,
  imagesByCompany,
  logos,
  height = 360,
  bounds = { minW: 200, maxW: 520, minH: 140, maxH: 360 },
  maxLayers = 24,
  fixedBase = true,
  baseIndex = 0,
  includeBaseInCycle = false,
  base, // optional: { w, h, left, top }
  baseScale = .85
}) {
  const { minW, maxW, minH, maxH } = bounds;

  const stageRef = React.useRef(null);
  const [stageSize, setStageSize] = React.useState({ w: 0, h: 0 });

  // Measure stage so we can place images inside it
  React.useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const cr = entry.contentRect;
      setStageSize({ w: cr.width, h: cr.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Memoize slug + photos
  const key = React.useMemo(() => toSlug(company), [company]);

  const photos = React.useMemo(() => {
    const arr =
      (imagesByCompany?.[key]?.length ? imagesByCompany[key] :
       (logos?.[key] ? [logos[key]] : [])) || [];
    return arr;
  }, [imagesByCompany, logos, key]);

  // Decide which photo is the fixed base (default first)
  const baseIdx = Math.min(Math.max(0, baseIndex), Math.max(photos.length - 1, 0));
  const baseUrl = fixedBase && photos.length ? photos[baseIdx] : null;

  // Photos we will cycle on clicks (exclude base if includeBaseInCycle=false)
  const cyclePhotos = React.useMemo(() => {
    if (!photos.length) return [];
    if (includeBaseInCycle) return photos;
    return photos.filter((_, i) => i !== baseIdx);
  }, [photos, includeBaseInCycle, baseIdx]);

  // Stacks
  const [baseLayer, setBaseLayer] = React.useState(null);   // fixed layer
  const [layers, setLayers] = React.useState([]);           // dynamic layers (top stack)
  const idxRef = React.useRef(0);                           // index into cyclePhotos

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Size helper within stage bounds
  const fitSize = React.useCallback(
    (w, h) => ({
      w: Math.min(w, Math.max(40, stageSize.w || w)),
      h: Math.min(h, Math.max(40, stageSize.h || h)),
    }),
    [stageSize.w, stageSize.h]
  );

  const randomSize = React.useCallback(() => {
    const w = rand(minW, maxW);
    const h = rand(minH, maxH);
    return fitSize(w, h);
  }, [minW, maxW, minH, maxH, fitSize]);

  const randomPosition = React.useCallback(
    (w, h) => {
      const maxLeft = Math.max(0, (stageSize.w || 0) - w);
      const maxTop = Math.max(0, (stageSize.h || 0) - h);
      return { left: rand(0, Math.floor(maxLeft)), top: rand(0, Math.floor(maxTop)) };
    },
    [stageSize.w, stageSize.h]
  );

  // Add next dynamic layer on click
  const addNext = React.useCallback(() => {
    if (!cyclePhotos.length || !stageSize.w || !stageSize.h) return;

    const url = cyclePhotos[idxRef.current % cyclePhotos.length];
    idxRef.current = (idxRef.current + 1) % cyclePhotos.length;

    const { w, h } = randomSize();
    const { left, top } = randomPosition(w, h);

    setLayers((prev) => {
      const next = [...prev, { url, w, h, left, top, z: prev.length + 2, id: `${Date.now()}-${prev.length}` }];
      if (next.length > maxLayers) next.splice(0, next.length - maxLayers);
      return next;
    });
  }, [cyclePhotos, stageSize.w, stageSize.h, randomSize, randomPosition, maxLayers]);

  // When company/stage changes: set fixed base, clear dynamic, and start cycle index at 0
  React.useEffect(() => {
    setLayers([]);
    idxRef.current = 0;

    if (baseUrl && stageSize.w && stageSize.h) {
      if (base && (base.w && base.h)) {
        const w = Math.min(base.w, stageSize.w);
        const h = Math.min(base.h, stageSize.h);
        const left = Math.min(Math.max(0, base.left ?? 0), Math.max(0, stageSize.w - w));
        const top  = Math.min(Math.max(0, base.top  ?? 0), Math.max(0, stageSize.h - h));
        setBaseLayer({ url: baseUrl, w, h, left, top, z: 1 });
      } else {
        // default: larger base & centered (scaled to stage size)
        const desiredW = Math.round((stageSize.w || 0) * baseScale);
        const desiredH = Math.round((stageSize.h || 0) * baseScale);
        // Clamp to stage & bounds
        const { w, h } = fitSize(
            Math.max(minW, desiredW),
            Math.max(minH, desiredH)
        );
        const left = Math.max(0, Math.round(((stageSize.w || w) - w) / 2));
        const top  = Math.max(0, Math.round(((stageSize.h || h) - h) / 2));
        setBaseLayer({ url: baseUrl, w, h, left, top, z: 1 });
        }
    } else {
      setBaseLayer(null);
    }
  }, [key, baseUrl, stageSize.w, stageSize.h, base, minW, maxW, minH, maxH, fitSize, baseScale]);


  if (!photos.length) return null;

  return (
    <section className="collage-stage-wrap" aria-label="Company photo stage">
      <div
        ref={stageRef}
        className="collage-stage"
        style={{ height: typeof height === "number" ? `${height}px` : height }}
        onClick={addNext}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && addNext()}
        title="Click to add next image"
        aria-label="Click to add next image"
      >
        {/* Fixed base (always at z=1) */}
        {baseLayer && (
          <figure
            className="collage-layer"
            style={{
              width: `${baseLayer.w}px`,
              height: `${baseLayer.h}px`,
              left: `${baseLayer.left}px`,
              top: `${baseLayer.top}px`,
              zIndex: 1,
            }}
          >
            <img src={baseLayer.url} alt="" className="collage-layer__img" />
          </figure>
        )}

        {/* Dynamic stack (z >= 2) */}
        {layers.map((l) => (
          <figure
            key={l.id}
            className="collage-layer"
            style={{
              width: `${l.w}px`,
              height: `${l.h}px`,
              left: `${l.left}px`,
              top: `${l.top}px`,
              zIndex: l.z,
            }}
          >
            <img src={l.url} alt="" className="collage-layer__img" />
          </figure>
        ))}

        <div className="collage-hint">click anywhere to add a photo</div>
      </div>
    </section>
  );
}
