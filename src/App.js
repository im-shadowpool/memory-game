import "./App.css";
import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";
import Home from "./pages/Home";
import ClashOfClans from "./pages/theme/ClashOfClans";
import AppWrapper from "./AppWrapper";
import Snow from "./pages/theme/Snow";
import WildForest from "./pages/theme/WildForest";
import Pumpkin from "./pages/theme/Pumpkin";
import SeaShell from "./pages/theme/SeaShell";
import Houses from "./pages/theme/Houses";



function App() {
  return (
    <div className="container">
    <h1 className="title">Memory Game</h1>

    <Router>
    <AppWrapper />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/theme/" element={<Home />} />
        <Route path="/theme/clash-of-clans" element={<ClashOfClans />} />
        <Route path="/theme/snow" element={<Snow />} />
        <Route path="/theme/forest" element={<WildForest />} />
        <Route path="/theme/pumpkin" element={<Pumpkin />} />
        <Route path="/theme/houses" element={<Houses />} />
        <Route path="/theme/sea-shell" element={<SeaShell />} />
      </Routes>
    </Router>
    </div>
   
  );
}

export default App;
