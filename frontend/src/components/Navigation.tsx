import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navigation: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="responsive-container flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-indigo-600">
          SafeHer
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <Link to="/about" className="hover:text-indigo-600">About</Link>
          <Link to="/resources" className="hover:text-indigo-600">Resources</Link>
          <Link to="/contact" className="hover:text-indigo-600">Contact</Link>

          <Link
            to="/login"
            className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Login
          </Link>
        </nav>

        {/* Mobile button */}
        <button
          className="md:hidden p-2 rounded-md"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>

      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <nav className="px-4 py-4 space-y-3 text-sm">
            <Link to="/" className="block">Home</Link>
            <Link to="/about" className="block">About</Link>
            <Link to="/resources" className="block">Resources</Link>
            <Link to="/contact" className="block">Contact</Link>

            <Link
              to="/login"
              className="block bg-indigo-600 text-white px-4 py-2 rounded-md"
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
