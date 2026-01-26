// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      <h1 style={{ fontSize: "72px", marginBottom: "0" }}>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" style={{ color: "#007bff", textDecoration: "underline" }}>
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;