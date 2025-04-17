import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function AppWrapper({ children }) {
  const location = useLocation();

  useEffect(() => {
    // Define route-based background colors
    const routeBackgrounds = {
      "/": "#1b1523",          // Light Blue for Home
      "/theme/clash-of-clans": "#180828",     // Misty Rose for About
      "/theme/snow": "#acd2f3",   
      "/theme/forest": "rgb(13 37 20)",   
      "/theme/pumpkin": "#853918",   
      "/theme/houses": "#D3B79E",   
      "/theme/sea-shell": "#cadfe1",   
      "/theme/temple": "#D3B79E",   
      "/theme/shapes": "#cadfe1",   
    };

    const bgColor = routeBackgrounds[location.pathname] || "#1b1523"; // default
    document.body.style.backgroundColor = bgColor;

    // Clean up on unmount if needed
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [location.pathname]);

  return children;
}

export default AppWrapper;
