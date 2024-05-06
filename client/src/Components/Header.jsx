import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

const Header = () => {
    const [searchitem, SetSearchItem] = useState("");
    console.log(searchitem);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlparmas = new URLSearchParams(window.location.search);
    urlparmas.set("searchTerm", searchitem);
    const searchQuery = urlparmas.toString();
    navigate(`/search?${searchQuery}`);
  };

  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const urlparams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlparams.get("searchTerm");
    if (searchTermFromUrl) {
      SetSearchItem(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <nav>
      <div className="flex justify-between items-ceter max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">My-</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className=" bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchitem}
            onChange={(e) => SetSearchItem(e.target.value)}
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avathar}
                alt="profile"
                className="rounded-full h-7 w-7 object-cover"
              />
            ) : (
              <li className=" sm:inline text-slate-700 hover:underline">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
