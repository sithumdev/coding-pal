import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Editor from "./pages/Editor";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/editor/:roomID" element={<Editor />} />
    </Routes>
  );
}

export default App;
