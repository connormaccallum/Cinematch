import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navLogo">
        <Link to="/">🎬 Cinematch</Link>
      </div>
      <ul className="navLinks">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/watchlist">Watchlist</Link></li>
        <li><Link to="/reviews">Reviews</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}
