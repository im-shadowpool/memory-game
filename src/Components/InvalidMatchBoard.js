import { Link } from "react-router-dom"
import "../ThemeCSS/invalid-theme.css"

const InvalidMatchBoard = ({message, themeName}) => {
  return (
    <div style={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
    <div className="invalid-board">
    <h2>❌ Invalid Board Size</h2>
    <p>{message}</p>
    <Link to="/theme">
      <button className={`${themeName}-button`}>Go Back</button>
    </Link>
  </div>
    </div>

  )
}

export default InvalidMatchBoard