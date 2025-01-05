import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FriendList from '../components/FriendList';
import SearchBar from '../components/SearchBar';
import FriendRecommendations from '../components/FriendRecommendations';

const HomePage = () => {
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendRecommendations, setFriendRecommendations] = useState([]);
  
  // Fetch friends, friend requests, and recommendations when the page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseFriends = await axios.get('/api/friends', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        const responseRequests = await axios.get('/api/friends/requests', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        const responseRecommendations = await axios.get('/api/friends/recommendations', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        
        setFriends(responseFriends.data);
        setFriendRequests(responseRequests.data);
        setFriendRecommendations(responseRecommendations.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  // Handle user search
  const handleSearch = async (query) => {
    try {
      const response = await axios.get(`/api/users/search?query=${query}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>

      {/* Search Bar for searching users */}
      <SearchBar onSearch={handleSearch} />

      {/* Display search results */}
      <div>
        <h3>Search Results</h3>
        <ul>
          {searchResults.map(user => (
            <li key={user._id}>
              {user.username}
              <button onClick={() => handleSendFriendRequest(user._id)}>Send Friend Request</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Display Friend Recommendations */}
      <FriendRecommendations recommendations={friendRecommendations} />

      {/* Display user's Friend List */}
      <FriendList friends={friends} friendRequests={friendRequests} />
    </div>
  );
};

const handleSendFriendRequest = async (receiverId) => {
  try {
    await axios.post(`/api/friends/request/${receiverId}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    alert('Friend request sent!');
  } catch (error) {
    console.error('Error sending friend request:', error);
  }
};

export default HomePage;
