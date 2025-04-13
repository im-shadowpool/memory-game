import { useState } from "react";
import { Link } from "react-router-dom";

const themes = [
  {
    name: "Clash of Clans",
    path: "clash-of-clans",
    img: "/CardImages/coc/coc-bg.jpg",
  },
  {
    name: "Snow",
    path: "snow",
    img: "/CardImages/snow/bg.webp",
  },
  {
    name: "Forest",
    path: "forest",
    img: "/CardImages/forest/forest-bg.webp",
  },
  {
    name: "Pumpkin",
    path: "pumpkin",
    img: "/CardImages/pumpkin/bg.webp",
  },
  {
    name: "Houses",
    path: "houses",
    img: "/CardImages/houses/bg.webp"
  },
  {
    name: "Sea Shell",
    path: "sea-shell",
    img: "/CardImages/sea-shell/bg.webp"
  }
];

const boardSizes = ["2x3", "3x4", "3x6", "4x5", "4x6"];

const ThemeSelection = () => {
  const [selectedBoard, setSelectedBoard] = useState(() => {
    return localStorage.getItem("preferedBoardSize") || "3x4";
  });

  return (
    <div className="theme-container">
      <h2 className="theme-heading">Select a Theme</h2>

      <div className="board-selector">
        <div className="board-options">
          {boardSizes.map((size) => (
            <button
              key={size}
              className={`board-button ${selectedBoard === size ? "active" : ""}`}
              onClick={() => {
                setSelectedBoard(size)
                localStorage.setItem("preferedBoardSize", size);
                }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
     
      <div className="theme-grid">
        {themes.map((theme) => (
          <Link
            to={`/theme/${theme.path}?board=${selectedBoard}`}
            key={theme.path}
            className="theme-link"
          >
            <div className="theme-card">
              <img src={theme.img} alt={theme.name} />
              <p>{theme.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelection;
