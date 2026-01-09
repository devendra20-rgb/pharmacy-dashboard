import React, { useState } from 'react';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Shared state for toggle

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // Toggle class on sidebar for mobile
    const sidebar = document.querySelector('.sidebar-nav');
    if (sidebar) {
      sidebar.classList.toggle('d-none');
    }
  };

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Container fluid>
        {/* Toggle Button for Sidebar (Hamburger for mobile) */}
        <Button
          variant="link"
          className="navbar-toggler d-md-none text-white me-2"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className={`fas fa-bars ${sidebarCollapsed ? 'fa-times' : ''}`}></i>
        </Button>
        
        <Link className="navbar-brand" to="/dashboard">Medical Admin Dashboard</Link>
        <BSNavbar.Toggle aria-controls="navbarNav" />
        <BSNavbar.Collapse id="navbarNav">
          <Nav className="ms-auto">
            <Nav.Link href="#"><i className="fas fa-user me-1"></i>Profile</Nav.Link>
            <Nav.Link href="#"><i className="fas fa-sign-out-alt me-1"></i>Logout</Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;