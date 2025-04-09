import "./App.css";
import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";
import Home from "./pages/Home";
import ClashOfClans from "./pages/theme/ClashOfClans";
import AppWrapper from "./AppWrapper";
import Snow from "./pages/theme/Snow";
import WildForest from "./pages/theme/WildForest";
import Pumpkin from "./pages/theme/Pumpkin";



function App() {
  return (
    <div className="App">
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
      </Routes>
    </Router>
    </div>
   
  );
}

export default App;
