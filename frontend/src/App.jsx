import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import UrlScanner from "./pages/UrlScanner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/url-scanner" element={<UrlScanner />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;