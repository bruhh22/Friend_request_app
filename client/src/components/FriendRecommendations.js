// client/src/components/FriendRecommendations.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FriendRecommendations = ({ userId }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch friend recommendations based on mutual friends or other criteria
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(`/api/friends/recommendations/${userId}`);
                setRecommendations(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching recommendations', error);
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [userId]);

    if (loading) {
        return <div>Loading recommendations...</div>;
    }

    return (
        <div>
            <h3>Friend Recommendations</h3>
            <ul>
                {recommendations.length > 0 ? (
                    recommendations.map((user) => (
                        <li key={user._id}>
                            <div>{user.username}</div>
                            {/* Add additional information like mutual friends if needed */}
                            <button>Send Friend Request</button>
                        </li>
                    ))
                ) : (
                    <li>No recommendations found</li>
                )}
            </ul>
        </div>
    );
};

export default FriendRecommendations;
