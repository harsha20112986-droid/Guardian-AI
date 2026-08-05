import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import UrlScanner from "./pages/UrlScanner";
import QRScanner from "./pages/QRScanner";
import SMSScanner from "./pages/SMSScanner";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/url-scanner" element={<UrlScanner />} />
        <Route path="/qr-scanner" element={<QRScanner />} />
        <Route path="/sms-scanner" element={<SMSScanner />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route
  path="/history"
  element={
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-3xl font-bold">
      History Page Coming Soon 🚀
    </div>
  }
/>      
      </Routes>
    </BrowserRouter>
  );
}

export default App;