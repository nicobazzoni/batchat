import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, onSnapshot, getDocs, query, orderBy } from 'firebase/firestore';

import { db, auth } from '../../firebase';
import { useParams } from 'react-router-dom';

const SendMessageComponent = ({ user }) => {
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const { userId: recipientUserId } = useParams();

    const currentUserId = auth.currentUser?.uid;  // This line gets the current user's ID
    console.log(currentUserId);

    useEffect(() => {
        if (recipientUserId) {
            const recipient = users.find(user => user.id === recipientUserId);
            if (recipient) setSelectedUser(recipient);
        }
    }, [users, recipientUserId]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(db, 'users');
            const userSnapshot = await getDocs(usersCollection);
            const userList = userSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(userList);
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            const chatRoomId = [currentUserId, selectedUser.id].sort().join('_');
            const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');
            const unsubscribe = onSnapshot(query(messagesRef, orderBy('timestamp', 'desc')), snapshot => {
                const fetchedMessages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMessages(fetchedMessages);
                console.log(fetchedMessages);
            });
            

            return () => unsubscribe(); // Cleanup listener on component unmount
        }
    }, [selectedUser]);

    const sendMessage = async () => {
        if (message.trim() === '') return;
        if (!selectedUser) {
            console.error("No user selected!");
            return;
        }

        const chatRoomId = [currentUserId, selectedUser?.id].sort().join('_');
        console.log("Chat Room ID:", chatRoomId);

        const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');
        const messageQuery = query(messagesRef, orderBy('timestamp', 'desc'));


        

        try {
            await addDoc(messagesRef, {
                text: message,
                timestamp: serverTimestamp(),
                senderId: currentUserId
            });

            setMessage(''); // Clear the message input
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    };

    console.log(messages);

    return (
        <div className='bg-black text-gray-400 h-full flex flex-col'>
            <div className='flex-1 overflow-y-auto p-4 bg-gray-900 bg-opacity-80 backdrop-blur-md backdrop-filter'>
    
                <div className="messages">
                    {messages.slice(0).reverse().map(msg => (
                  <div key={msg.id} className={`my-2 ${msg.senderId === currentUserId ? 'text-right' : ''}`}>
                  {msg.senderId !== currentUserId && (
                      <strong className="block text-gray-200 tracking-wide mb-1">
                          {selectedUser?.displayName}:
                      </strong>
                  )}
                  <p className={`inline-block px-3 py-2 rounded ${msg.senderId === currentUserId ? 'bg-blue-700 text-white shadow-md' : 'bg-gray-700 text-gray-300 shadow-md'}`}>
                      {msg.text}
                  </p>
              </div>
                    ))}
                </div>
            </div>
    
            <div className='border-t p-4 bg-gray-800'>
                <h1 className="text-xl text-gray-300 tracking-wider mb-2">Send a message</h1>
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className='w-full p-2 rounded border bg-gray-700 text-gray-300 focus:ring focus:ring-blue-600 focus:border-blue-600'
                />
                <button onClick={sendMessage} className='mt-2 bg-blue-700 hover:bg-blue-800 text-white p-2 rounded shadow-md transition duration-300'>Send</button>
            </div>
        </div>
    );
    
}

export default SendMessageComponent;
