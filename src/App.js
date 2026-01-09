import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import Conditions from './pages/Conditions';
import WellBeing from './pages/WellBeing';
import Doctors from './pages/Doctors';
import Categories from './pages/Categories';
import Diseases from './pages/Disease';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Navbar />
        <div className="d-flex flex-grow-1 flex-fill">
          <div className="d-flex flex-grow-1">
            <div className="col-md-2 d-md-block bg-white border-end p-0 flex-shrink-0" style={{ height: 'calc(100vh - 56px)' }}>  {/* Fixed height minus navbar */}
              <Sidebar />
            </div>
            <div className="col-md-10 p-4 d-flex flex-column flex-grow-1 overflow-auto">
              <main className="flex-grow-1">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/conditions" element={<Conditions />} />
                  <Route path="/wellbeing" element={<WellBeing />} />
                  <Route path="/doctors" element={<Doctors />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/diseases" element={<Diseases />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
        <footer className="bg-dark text-white text-center py-3 mt-auto">
          <p className="mb-0">&copy; 2026 Medical Admin. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;