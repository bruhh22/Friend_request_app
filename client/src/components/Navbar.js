// Importing necessary dependencies
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Custom CSS for styling the Navbar

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Simulating authentication check (you can replace this with real auth logic)
    useEffect(() => {
        const token = localStorage.getItem('authToken'); // Example: check JWT token
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Remove the token from localStorage
        setIsAuthenticated(false); // Update state to reflect logged-out status
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h1>FriendSearch</h1>
            </div>
            <div className="navbar-right">
                <ul>
                    {/* Home Link */}
                    <li>
                        <Link to="/" className="navbar-link">
                            Home
                        </Link>
                    </li>

                    {/* Conditional Rendering for Authentication */}
                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link to="/dashboard" className="navbar-link">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <button className="navbar-button" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="navbar-link">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/signup" className="navbar-link">
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
