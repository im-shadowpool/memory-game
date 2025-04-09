import { Link } from "react-router-dom";

const ThemeSelection = () => {
  return (
    <div className="theme-container">
      <h2>Select theme to continue</h2>
      <div className="theme-selection">
        <Link to={"/theme/clash-of-clans"}>
          <div className="theme-card">
            <img src="/CardImages/coc/coc-bg.jpg" alt="clash-of-clans" />
            
          </div>
        </Link>
        <Link to={"/theme/snow"}>
        <div className="theme-card">
          <img src="/CardImages/snow/bg.webp" alt="clash-of-clans" />
        </div>
        </Link>
        <Link to={"/theme/forest"}>
        <div className="theme-card">
          <img src="/CardImages/forest/forest-bg.webp" alt="clash-of-clans" />
        </div>
        </Link>
        <Link to={"/theme/pumpkin"}>
        <div className="theme-card">
          <img src="/CardImages/pumpkin/bg.webp" alt="clash-of-clans" />
        </div>
        </Link> 
      </div>
    </div>
  );
};

export default ThemeSelection;
