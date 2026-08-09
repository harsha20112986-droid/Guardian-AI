import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col">

      {/* Navbar */}
      <header className="w-full">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default Layout;