// client/src/components/FriendList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FriendList = () => {
    const [friends, setFriends] = useState([]);

    // Fetch friends from the backend
    useEffect(() => {
        // Assuming we have an authenticated user and their ID
        const fetchFriends = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/friends', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // JWT token
                    }
                });
                setFriends(res.data); // Assuming backend sends list of friends
            } catch (error) {
                console.error("Error fetching friends:", error);
            }
        };

        fetchFriends();
    }, []);

    // Function to unfriend a user
    const unfriend = async (friendId) => {
        try {
            await axios.delete(`http://localhost:5000/api/friends/${friendId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // JWT token
                }
            });
            setFriends(friends.filter(friend => friend._id !== friendId)); // Remove the friend from the list
        } catch (error) {
            console.error("Error unfriending:", error);
        }
    };

    return (
        <div className="friend-list">
            <h2>Your Friends</h2>
            <ul>
                {friends.length > 0 ? (
                    friends.map(friend => (
                        <li key={friend._id}>
                            <span>{friend.username}</span>
                            <button onClick={() => unfriend(friend._id)}>Unfriend</button>
                        </li>
                    ))
                ) : (
                    <p>No friends yet.</p>
                )}
            </ul>
        </div>
    );
};

export default FriendList;
