// AppLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import LandingNameIntro from "./LandingNameIntro";
import { Link } from "react-router-dom";
import "./AppLayout.css";

export default function AppLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  return (
    <>
      <main>
         <Link to="/" textDecoration="none" color="Black">
          <LandingNameIntro
            first="DLET"
            last="HABTEMARIAM"
            playOnMount={isHome}     // Play intro only on the home route
            variant={isHome ? "hero" : "compact"}  // Shrink on other pages
            startDelay={300}
          />
        </Link>
        
        <Outlet />
      </main>
    </>
  );
}
