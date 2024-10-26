import React, { useEffect, useState } from 'react';
import supabase from '@/supabase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const UserInviteModal = ({ isOpen, onClose }) => {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [currentLoginUserId, setCurrentLoginUserId] = useState();
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        const fetchUsers = async () => {
            const currentUser = await supabase.auth.getUser();
            setCurrentLoginUserId(currentUser.data.user.id);
            const { data, error } = await supabase
                .from('user_info')
                .select('*');

            setCurrentUser(
                data.find(user => user.user_id === currentUser.data.user.id)
            );

            if (error) {
                console.error('Error fetching users:', error);
            } else {
                console.log('Fetched users:', data);
                setUsers(data);
            }
        };

        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const handleInvite = async (friendId) => {
        try {
            const currentUser = await supabase.auth.getUser();
            const { data, error: fetchError } = await supabase
                .from('user_info')
                .select('friends')
                .eq('user_id', currentUser.data.user.id)
                .single();

            if (fetchError) {
                console.error('Error fetching user friends:', fetchError);
                return;
            }

            const newFriend = { id: friendId, status: false };
            const updatedFriends = data.friends ? [...data.friends, newFriend] : [newFriend];

            const { error: updateError } = await supabase
                .from('user_info')
                .update({ friends: updatedFriends })
                .eq('user_id', currentUser.data.user.id);

            if (updateError) {
                console.error('Error updating friends:', updateError);
            } else {
                router.refresh();
            }
        } catch (error) {
            console.error('Error inviting user:', error);
        }
    };

    const handleAcceptInvite = async (inviterId) => {
        try {
            const { data: inviterData, error: fetchError } = await supabase
                .from('user_info')
                .select('friends')
                .eq('user_id', inviterId) // Fetch inviter's friends list
                .single();
    
            if (fetchError) {
                console.error('Error fetching inviter’s friends:', fetchError);
                return;
            }
    
            // Check if the current user is already friends with the inviter
            const isCurrentUserFriendsWithInviter = inviterData.friends?.some(friend => 
                friend.id === currentLoginUserId && friend.status === true
            );
    
            // Update inviter's friend status for the current user to true
            const updatedInviterFriends = inviterData.friends.map(friend => 
                friend.id === currentLoginUserId ? { ...friend, status: true } : friend
            );
    
            await supabase
                .from('user_info')
                .update({ friends: updatedInviterFriends })
                .eq('user_id', inviterId);
    
            // Now update the current user's friends list to include the inviter if not already present
            const { data: currentUserData, error: currentFetchError } = await supabase
                .from('user_info')
                .select('friends')
                .eq('user_id', currentLoginUserId) // Fetch current user's friends list
                .single();
    
            if (currentFetchError) {
                console.error('Error fetching current user friends:', currentFetchError);
                return;
            }
    
            // Ensure friends is an array or initialize it as an empty array
            const currentUserFriends = currentUserData.friends || [];
    
            const updatedCurrentUserFriends = currentUserFriends.map(friend => 
                friend.id === inviterId ? { ...friend, status: true } : friend
            );
    
            // If the inviter is not already in the current user's friend list, add them
            if (!updatedCurrentUserFriends.some(friend => friend.id === inviterId)) {
                updatedCurrentUserFriends.push({ id: inviterId, status: true }); // Set status to true since they accepted
            }
    
            await supabase
                .from('user_info')
                .update({ friends: updatedCurrentUserFriends })
                .eq('user_id', currentLoginUserId);
    
            router.refresh();
        } catch (error) {
            console.error('Error accepting invitation:', error);
        }
    };
    

    const hasSentInvite = (userId) => {
        return currentUser?.friends?.some(friend => friend.id === userId && friend.status === false);
    };

    const hasReceivedInvite = (userId) => {
        const user = users.find(user => user.user_id === userId);
        return user?.friends?.some(friend => friend.id === currentLoginUserId && friend.status === false);
    };

    const areFriends = (userId) => {
        return currentUser?.friends?.some(friend => friend.id === userId && friend.status === true);
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg p-5 w-96">
                    <h2 className="text-xl font-bold mb-4 text-black">Invite Friends</h2>
                    <ul>
                        {users.map((user) => {
                            const isSelf = user.user_id === currentLoginUserId;
                            const hasSent = hasSentInvite(user.user_id);
                            const hasReceived = hasReceivedInvite(user.user_id);
                            const isFriends = areFriends(user.user_id);

                            return !isSelf && (
                                <li key={user.user_id} className="flex items-center justify-between border-gray-200 py-2">
                                    <div className="flex items-center space-x-2 text-black">
                                        <Image
                                            src={user.info.avatar_url}
                                            alt={user.info.full_name}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                        <span>{user.info.full_name}</span>
                                    </div>
                                    {isFriends ? (
                                        <button
                                            className="bg-gray-300 text-black py-1 px-3 rounded"
                                            disabled
                                        >
                                            Friends
                                        </button>
                                    ) : hasReceived ? (
                                        <button
                                            onClick={() => handleAcceptInvite(user.user_id)}
                                            className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                                        >
                                            Accept
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleInvite(user.user_id)}
                                            className={`py-1 px-3 rounded ${hasSent ? 'bg-gray-300 text-black' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                            disabled={hasSent}
                                        >
                                            {hasSent ? 'Invited' : 'Invite'}
                                        </button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                    <button
                        onClick={onClose}
                        className="mt-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        )
    );
};

export default UserInviteModal;
