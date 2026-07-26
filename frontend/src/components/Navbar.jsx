import { Shield } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-slate-950 text-white px-8 py-5 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Shield className="text-emerald-400" size={30} />
        <h1 className="text-2xl font-bold">Guardian AI</h1>
      </div>

      <div className="flex gap-8">
        <a href="#" className="hover:text-emerald-400">Home</a>
        <a href="#" className="hover:text-emerald-400">Features</a>
        <a href="#" className="hover:text-emerald-400">About</a>
      </div>

      <button className="bg-emerald-500 px-5 py-2 rounded-lg hover:bg-emerald-600 transition">
        Login
      </button>
    </nav>
  );
}

export default Navbar;