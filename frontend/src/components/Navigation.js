import { Link, useLocation } from "react-router-dom";

function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo" style={{ cursor: "pointer", textDecoration: "none" }}>
        <img
          src="https://i.postimg.cc/nLh2w8mP/transbashologo.png"
          alt="Basho Logo"
        />
      </Link>

      {/* Navigation Links */}
      <div className="nav-links">
        <Link
          to="/products"
          className={currentPath === "/products" ? "active" : ""}
        >
          Collections
        </Link>

        <Link
          to="/workshops"
          className={currentPath === "/workshops" ? "active" : ""}
        >
          Workshops
        </Link>

        <Link
          to="/studio"
          className={currentPath === "/studio" ? "active" : ""}
        >
          Studio
        </Link>

        <Link
          to="/corporate"
          className={currentPath === "/corporate" ? "active" : ""}
        >
          Corporate
        </Link>

        <Link
          to="/media"
          className={currentPath === "/media" ? "active" : ""}
        >
          Media
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;
