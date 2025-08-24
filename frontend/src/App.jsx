import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Khata from './components/Khata';
import Roznamcha from './components/Roznamcha';
import BillBook from './components/BillBook';
import RoznamchaScreenshot from './components/RoznamchaScreenshot'; // 🔹 New Screenshot Page
import '../index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('isAuthenticated') === 'true'   // 👈 localStorage → sessionStorage
  );

  // Shared state to trigger Khata page refresh when Roznamcha updates
  const [refreshParties, setRefreshParties] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />

        {/* Home Page */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home setAuth={setIsAuthenticated} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Khata (Accounts) Page */}
        <Route
          path="/accounts"
          element={
            isAuthenticated ? (
              <Khata refreshTrigger={refreshParties} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Roznamcha (Daily Ledger) Page */}
        <Route
          path="/entries"
          element={
            isAuthenticated ? (
              <Roznamcha refreshParties={() => setRefreshParties((prev) => !prev)} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 🔹 Roznamcha Screenshot Page */}
        <Route
          path="/roznamcha/screenshot/:date"
          element={
            isAuthenticated ? (
              <RoznamchaScreenshot />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 🔹 Bill Book Page */}
        <Route
          path="/billbook"
          element={
            isAuthenticated ? (
              <BillBook setAuth={setIsAuthenticated} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
