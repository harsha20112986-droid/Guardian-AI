import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#F4F8F6] text-[#17231D] flex flex-col">
      <Navbar />

      <main className="flex-1 bg-[#F4F8F6]">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default Layout;