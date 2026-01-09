import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle function for manual toggle (call from Navbar button)
  const toggleSidebar = () => setCollapsed(!collapsed);

  // Expose toggle to parent (Navbar) via useImperativeHandle or just use local for now
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`bg-white border-end vh-100 p-2 d-${
        collapsed ? "none" : "block"
      } d-md-block col-md-2 col-lg-2 position-relative transition-all sidebar-nav`} // Added sidebar-nav class for toggle
      style={{ transition: 'transform 0.3s ease' }} // Smooth toggle animation
    >
      <div className="position-sticky pt-2"> {/* Reduced pt-3 to pt-2 */}
        <h6 className="text-muted mb-3"> {/* Reduced mb-4 to mb-3 */}
          <i className="fas fa-bars me-2"></i>MENU
        </h6>
        <Nav className="flex-column">
          <Nav.Item className="mb-1"> {/* Added mb-1 for consistent small gap */}
            <Link
              to="/dashboard"
              className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
              style={{ display: "flex", alignItems: "center", padding: "0.5rem 1rem" }} // Consistent padding
            >
              <i
                className="fas fa-tachometer-alt me-2"
                style={{ width: 20, textAlign: "center" }}
              />
              <span>Dashboard</span>
            </Link>
          </Nav.Item>
          <Nav.Item className="mb-1">
            <Link
              to="/articles"
              className={`nav-link ${isActive("/articles") ? "active" : ""}`}
              style={{ display: "flex", alignItems: "center", padding: "0.5rem 1rem" }}
            >
              <i
                className="fas fa-newspaper me-2"
                style={{ width: 20, textAlign: "center" }}
              />
              <span>Articles</span>
            </Link>
          </Nav.Item>
          <Nav.Item className="mb-1">
            <Link
              to="/conditions"
              className={`nav-link ${isActive("/conditions") ? "active" : ""}`}
              style={{ display: "flex", alignItems: "center", padding: "0.5rem 1rem" }}
            >
              <i
                className="fas fa-stethoscope me-2"
                style={{ width: 20, textAlign: "center" }}
              />
              <span>Conditions</span>
            </Link>
          </Nav.Item>
          <Nav.Item className="mb-1">
            <Link
              to="/diseases"
              className={`nav-link ${isActive("/diseases") ? "active" : ""}`}
              style={{ display: "flex", alignItems: "center", padding: "0.5rem 1rem" }}
            >
              <i
                className="fas fa-disease me-2"  // Icon for Diseases
                style={{ width: 20, textAlign: "center" }}
              />
              <span>Diseases</span>
            </Link>
          </Nav.Item>
          <Nav.Item className="mb-1">
            <Link
              to="/wellbeing"
              className={`nav-link ${isActive("/wellbeing") ? "active" : ""}`}
              style={{ display: "flex", alignItems: "center", padding: "0.5rem 1rem" }}
            >
              <i
                className="fas fa-heart me-2"
                style={{ width: 20, textAlign: "center" }}
              />
              <span>Well-Being</span>
            </Link>
          </Nav.Item>
          <Nav.Item className="mb-1">
            <Link
              to="/doctors"
              className={`nav-link ${isActive("/doctors") ? "active" : ""}`}
              style={{ display: "flex", alignItems: "center", padding: "0.5rem 1rem" }}
            >
              <i
                className="fas fa-user-md me-2"
                style={{ width: 20, textAlign: "center" }}
              />
              <span>Doctors</span>
            </Link>
          </Nav.Item>
          <Nav.Item className="mb-1"> {/* Reduced gap here too */}
            <Link
              to="/categories"
              className={`nav-link ${isActive("/categories") ? "active" : ""}`}
              style={{ display: "flex", alignItems: "center", padding: "0.5rem 1rem" }}
            >
              <i
                className="fas fa-tags me-2"
                style={{ width: 20, textAlign: "center" }}
              />
              <span>Categories</span>
            </Link>
          </Nav.Item>
        </Nav>
      </div>
    </nav>
  );
};

export default Sidebar;