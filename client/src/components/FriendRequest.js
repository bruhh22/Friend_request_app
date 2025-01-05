// client/src/components/FriendRequest.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendRequest = ({ userId, friendId }) => {
    const [friendStatus, setFriendStatus] = useState(null); // pending, accepted, rejected
    const [isRequestSent, setIsRequestSent] = useState(false);

    useEffect(() => {
        // Check if there is already a pending or accepted request
        const fetchRequestStatus = async () => {
            try {
                const response = await axios.get(`/api/friends/status/${userId}/${friendId}`);
                setFriendStatus(response.data.status);
                setIsRequestSent(response.data.status === 'pending');
            } catch (error) {
                console.error('Error fetching friend request status', error);
            }
        };
        fetchRequestStatus();
    }, [userId, friendId]);

    // Handle sending a friend request
    const sendFriendRequest = async () => {
        try {
            await axios.post(`/api/friends/request/${friendId}`);
            setIsRequestSent(true);
            setFriendStatus('pending');
        } catch (error) {
            console.error('Error sending friend request', error);
        }
    };

    // Handle accepting a friend request
    const acceptFriendRequest = async () => {
        try {
            await axios.patch(`/api/friends/accept/${friendId}`);
            setFriendStatus('accepted');
        } catch (error) {
            console.error('Error accepting friend request', error);
        }
    };

    // Handle rejecting a friend request
    const rejectFriendRequest = async () => {
        try {
            await axios.patch(`/api/friends/reject/${friendId}`);
            setFriendStatus('rejected');
        } catch (error) {
            console.error('Error rejecting friend request', error);
        }
    };

    return (
        <div>
            {friendStatus === 'pending' ? (
                <div>
                    <button onClick={acceptFriendRequest}>Accept</button>
                    <button onClick={rejectFriendRequest}>Reject</button>
                </div>
            ) : isRequestSent ? (
                <span>Friend request sent</span>
            ) : (
                <button onClick={sendFriendRequest}>Send Friend Request</button>
            )}
        </div>
    );
};

export default FriendRequest;
