import { Flame, LogOut, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import useAuth from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";

const Header = () => {
  const [profile, setProfile] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { state, dispatch } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const accessToken = auth?.accessToken;
  const { api } = useAxios();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile/");
        setProfile(response?.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    if (accessToken) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [accessToken, api]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setAuth({});
    setProfile(null);
    dispatch({
      type: "SET_CART",
      payload: {
        items: [],
        subtotal: 0,
        total: 0,
        itemCount: 0,
      },
    });

    navigate("/");
  };

  return (
    <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
      <nav className="nav-shell" aria-label="Main navigation">
        <Link className="brand-mark" to="/" aria-label="Nocturne home">
          <span className="brand-symbol"><Flame size={18} /></span>
          <span>Nocturne</span>
        </Link>
        <button
          className="nav-menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <div className={`nav-content ${menuOpen ? "menu-open" : ""}`}>
          <div className="nav-links">
            <Link className={location.pathname === "/" ? "active" : ""} to="/">
              Home
            </Link>
            <Link to="/#products" onClick={() => setMenuOpen(false)}>Collection</Link>
            <Link to="/#about" onClick={() => setMenuOpen(false)}>Our story</Link>
          </div>
          <div className="nav-actions">
            <Link
              className={`nav-cart ${location.pathname === "/cart" ? "active" : ""}`}
              to="/cart"
              aria-label={`Shopping bag${state?.itemCount ? `, ${state.itemCount} items` : ""}`}
            >
              <ShoppingBag size={18} />
              <span>Bag</span>
              {state?.itemCount > 0 && (
                <span className="nav-cart-count">{state.itemCount}</span>
              )}
            </Link>
            {!accessToken ? (
              <div className="nav-auth-links">
                <Link
                  className={`nav-login ${location.pathname === "/login" ? "active" : ""}`}
                  to="/login"
                >
                  Login
                </Link>
                <Link className="nav-signup" to="/signup">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="nav-account">
                <Link className="nav-account-link" to="/dashboard" title="Dashboard">
                  <UserRound size={17} />
                  <span>{profile?.username || "Account"}</span>
                </Link>
                <button
                  type="button"
                  className="nav-logout"
                  onClick={handleLogout}
                  aria-label="Log out"
                  title="Log out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
