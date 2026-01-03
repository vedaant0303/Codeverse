import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import VendorDetail from './pages/VendorDetail';
import { LocationProvider } from './context/LocationContext';
import './App.css';

function App() {
  return (
    <LocationProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/vendor/:id" element={<VendorDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LocationProvider>
  );
}

export default App;
