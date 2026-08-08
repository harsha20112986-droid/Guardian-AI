import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white">

      <h1 className="text-8xl font-bold">
        404
      </h1>

      <p className="text-2xl mt-4">
        Page Not Found
      </p>

      <Link
        to="/"
        className="mt-8 bg-emerald-500 px-6 py-3 rounded-xl"
      >
        Return Home
      </Link>

    </div>
  );
}

export default NotFound;