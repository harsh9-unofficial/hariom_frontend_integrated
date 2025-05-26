import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoSearch } from "react-icons/go";
import { PiShoppingCart } from "react-icons/pi";
import { GoHeart } from "react-icons/go";
import { RiUser3Line } from "react-icons/ri";
import { LuMenu } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";
import { IoArrowForward } from "react-icons/io5";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const desktopUserMenuRef = useRef(null);
  const mobileUserMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close menus and check auth on route change
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    setIsAuthenticated(!!(token && userId));
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Handle click outside to close menus and search bar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target) &&
        !e.target.closest("button[aria-label='Toggle search bar']")
      ) {
        setIsSearchOpen(false);
        setShowResults(false);
      }
      if (
        desktopUserMenuRef.current &&
        !desktopUserMenuRef.current.contains(e.target) &&
        mobileUserMenuRef.current &&
        !mobileUserMenuRef.current.contains(e.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setIsSearchOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const toggleSearchBar = () => {
    setIsSearchOpen((prev) => {
      const newState = !prev;
      if (newState) {
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.querySelector("input")?.focus();
          }
        }, 100);
      }
      return newState;
    });
    setIsMobileMenuOpen(false);
  };

  const handleSearchChange = (e) => {
    console.log("Search query:", e.target.value); // Debug
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      console.log(
        "Navigating to:",
        `/products?search=${encodeURIComponent(searchQuery)}`
      );
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "All Product", path: "/products" },
    { name: "Combos", path: "/combos" },
    { name: "About us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="w-full font-sans bg-[#393185] shadow-lg sticky top-0 z-50">
      {/* Top Banner */}
      <div className="bg-[#393185] text-white text-center py-2.5 text-sm md:text-base border-b border-white/20">
        Free shipping on all orders above $499
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto flex justify-between items-center px-4 md:px-5 lg:px-6 xl:px-8 py-3 bg-[#393185]">
        {/* Logos */}
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center"
            aria-label="Go to homepage"
          >
            <img
              src="/images/logo-new1.png"
              alt="Harlom Chemicals Logo 1"
              className="h-9 md:h-10 lg:h-12 cursor-pointer"
            />
            <img
              src="/images/logo-new.png"
              alt="Harlom Chemicals Logo 2"
              className="h-9 md:h-10 lg:h-12 cursor-pointer"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white text-2xl focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <RxCross1 /> : <LuMenu />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-3 lg:space-x-5 xl:space-x-7">
          {navLinks.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`${
                  isActive(item.path)
                    ? "text-[#558AFF] font-bold border-b-2 border-[#558AFF]"
                    : "text-white"
                } text-sm md:text-sm lg:text-base xl:text-lg font-medium hover:text-[#558AFF] hover:border-b-2 hover:border-[#558AFF] transition-all duration-200 pb-1`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Action Buttons */}
        <div className="flex items-center space-x-2 lg:space-x-3 xl:space-x-4">
          <button
            onClick={toggleSearchBar}
            className="text-[#393185] p-2.5 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            aria-label="Toggle search bar"
          >
            <GoSearch className="text-base" />
          </button>
          <div
            className="flex items-center space-x-2 lg:space-x-3"
            ref={desktopUserMenuRef}
          >
            <Link
              to="/cart"
              className="text-[#393185] p-2.5 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="View cart"
            >
              <PiShoppingCart className="text-base" />
            </Link>
            <Link
              to="/wishlist"
              className="text-[#393185] p-2.5 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="View wishlist"
            >
              <GoHeart className="text-base" />
            </Link>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="text-[#393185] p-2.5 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Toggle user menu"
                >
                  <RiUser3Line className="text-base" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-2 z-50">
                    <Link
                      to="/track-order"
                      className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-[#393185] p-2.5 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Login"
              >
                <RiUser3Line className="text-base" />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white transition-all pb-4 text-center ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <ul className="space-y-4 py-4 px-6">
          {navLinks.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`${
                  isActive(item.path)
                    ? "text-[#393185] font-bold"
                    : "text-black"
                } text-lg font-medium hover:text-[#393185] transition-colors duration-200`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="space-x-4 flex justify-center" ref={mobileUserMenuRef}>
          <button
            onClick={toggleSearchBar}
            className="text-white p-3 bg-[#393185] rounded-full text-lg cursor-pointer"
            aria-label="Toggle search bar"
          >
            <GoSearch />
          </button>
          <Link
            to="/cart"
            className="text-white p-3 bg-[#393185] rounded-full text-lg"
            aria-label="View cart"
          >
            <PiShoppingCart />
          </Link>
          <Link
            to="/wishlist"
            className="text-white p-3 bg-[#393185] rounded-full text-lg"
            aria-label="View wishlist"
          >
            <GoHeart />
          </Link>
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="text-white p-3 bg-[#393185] rounded-full text-lg"
                aria-label="Toggle user menu"
              >
                <RiUser3Line />
              </button>
              {isUserMenuOpen && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-36 bg-white rounded-md shadow-lg py-2 z-50">
                  <Link
                    to="/track-order"
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors duration-200 text-left"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200 text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-white p-3 bg-[#393185] rounded-full text-lg"
              aria-label="Login"
            >
              <RiUser3Line />
            </Link>
          )}
        </div>
      </div>

      {/* Unified Search Bar for All Screens */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-16">
          <div
            ref={searchInputRef}
            className="bg-white w-full max-w-md mx-4 p-4 rounded-lg shadow-xl md:max-w-lg lg:max-w-xl"
          >
            <div className="flex items-center gap-2">
              <GoSearch className="text-gray-500 text-lg" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                placeholder="Search for collections..."
                className="flex-1 text-sm border-none focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSearchSubmit}
                className="text-gray-500 hover:text-[#527557] transition-colors duration-200 cursor-pointer"
              >
                <IoArrowForward className="text-lg" />
              </button>
              <button
                onClick={toggleSearchBar}
                className="text-gray-500 hover:text-[#527557] transition-colors duration-200 cursor-pointer"
              >
                <RxCross1 className="text-lg" />
              </button>
            </div>
            <div className="border-t border-gray-200 mt-2 pt-2 max-h-60 overflow-y-auto">
              {showResults && searchQuery.trim() && searchResults.length > 0 ? (
                searchResults.map((collection) => (
                  <Link
                    key={collection.id}
                    to={`/collection/${collection.name}`}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded transition-colors duration-200"
                    onClick={toggleSearchBar}
                  >
                    {collection.images ? (
                      <img
                        src={collection.images}
                        alt={collection.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                    <p className="text-sm font-medium">{collection.name}</p>
                  </Link>
                ))
              ) : showResults && searchQuery.trim() ? (
                <p className="text-sm text-gray-500 text-center">
                  Searching...
                </p>
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  Type to search
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
