import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ScrollToTop.css"; // Ensure you have the CSS for fade effects

export default function ScrollToTop({ behavior = "smooth" }) {
  const { pathname, hash } = useLocation();
  const [fadeClass, setFadeClass] = useState("fade-enter");

  useEffect(() => {
    if (hash) return; // Skip if there's an anchor (#)

    // Start fade-out
    setFadeClass("fade-exit");

    const timeout = setTimeout(() => {
      // Scroll after fade-out
      window.scrollTo({ top: 0, left: 0, behavior });

      // Then fade-in
      setFadeClass("fade-enter");
    }, 300); // match fade duration

    return () => clearTimeout(timeout);
  }, [pathname, hash, behavior]);

  return <div className={fadeClass}></div>;
}
