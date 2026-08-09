import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import UrlScanner from "./pages/UrlScanner";
import QRScanner from "./pages/QRScanner";
import SMSScanner from "./pages/SMSScanner";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import About from "./pages/About";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          <Route path="/" element={<Home />} />

          <Route
            path="/url-scanner"
            element={<UrlScanner />}
          />

          <Route
            path="/qr-scanner"
            element={<QRScanner />}
          />

          <Route
            path="/sms-scanner"
            element={<SMSScanner />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/history"
            element={<History />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;