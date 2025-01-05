// src/components/SearchBar.js

import React, { useState } from 'react';
import axios from 'axios';  // Import Axios for making HTTP requests
import './SearchBar.css';  // Import the CSS file for styling

const SearchBar = () => {
    // States for search query, results, loading, and error handling
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle input change
    const handleChange = (e) => {
        setQuery(e.target.value);  // Update the query state
    };

    // Handle the search action
    const handleSearch = async () => {
        setIsLoading(true);  // Set loading state to true
        setError('');  // Reset error state

        try {
            // Send GET request to fetch search results
            const response = await axios.get(`/api/users/search?query=${query}`);
            setResults(response.data);  // Update state with search results
        } catch (err) {
            console.error('Error fetching search results:', err);
            setError('Failed to fetch users');  // Handle errors
        } finally {
            setIsLoading(false);  // Reset loading state
        }
    };

    // Handle form submission
    const handleFormSubmit = (e) => {
        e.preventDefault();  // Prevent default form behavior
        handleSearch();  // Trigger search
    };

    return (
        <div className="search-bar-container">
            <form onSubmit={handleFormSubmit} className="search-form">
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}  // Update query as user types
                    className="search-input"
                    placeholder="Search for users..."
                />
                <button type="submit" className="search-button">
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {/* Display results or error messages */}
            <div className="search-results">
                {error && <p className="error-message">{error}</p>}
                {results.length > 0 ? (
                    <ul>
                        {results.map((user) => (
                            <li key={user._id} className="search-result-item">
                                {user.username}
                            </li>
                        ))}
                    </ul>
                ) : (
                    !error && <p>No results found</p>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
