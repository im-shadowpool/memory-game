import { Link } from "react-router-dom";

const ThemeSelection = () => {
  return (
    <div className="theme-container">
      <h2>Select theme to continue</h2>
      <div className="theme-selection">
        <Link to={"/theme/clash-of-clans"}>
          <div className="theme-card">
            <img src="/CardImages/coc/coc-bg.jpg" alt="clash-of-clans" />
            <p>Clash of clans</p>
          </div>
        </Link>
        <div className="theme-card">
          <img src="/CardImages/coc/coc-bg.jpg" alt="clash-of-clans" />
          <p>Clash of clans</p>
        </div>
        <div className="theme-card">
          <img src="/CardImages/coc/coc-bg.jpg" alt="clash-of-clans" />
          <p>Clash of clans</p>
        </div>
        <div className="theme-card">
          <img src="/CardImages/coc/coc-bg.jpg" alt="clash-of-clans" />
          <p>Clash of clans</p>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelection;
