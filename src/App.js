import "./App.css";
import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";
import CardsComponent from "./Components/CardsComponent";
import ThemeSelection from "./Components/ThemeSelection";
import Home from "./pages/Home";
import ClashOfClans from "./pages/theme/ClashOfClans";
import AppWrapper from "./AppWrapper";

function App() {
  return (
    <div className="App">
    <h1 className="title">Memory Game</h1>
    
    <Router>
    <AppWrapper />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/theme/clash-of-clans" element={<ClashOfClans />} />
      </Routes>
    </Router>
    </div>
   
  );
}

export default App;
