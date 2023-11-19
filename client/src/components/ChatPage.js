import React, { useEffect, useState, useRef } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

const ChatPage = ({ socket }) => {
  const [messages, setMessages] = useState([]);

  const lastMessageRef = useRef(null);

  useEffect(() => {
    socket.on('oldMessages', (data) => {
      setMessages(data);
    });
  }, [socket]);
  
  // Fonction pour supprimer les messages redondants
const removeDuplicateMessages = (newMessages, existingMessages) => {
  const existingMessageIds = existingMessages.map((message) => message.id);

  // Filtrer les nouveaux messages pour exclure ceux qui ont un ID déjà présent dans les messages existants
  const filteredNewMessages = newMessages.filter((message) => !existingMessageIds.includes(message.id));

  return filteredNewMessages;
};

// Dans votre composant ChatPage
useEffect(() => {
  socket.on('messageResponse', (data) => {
    console.log('Received message on client:', data);

    // Appliquer la fonction pour supprimer les doublons
    setMessages((prevMessages) => [...prevMessages, ...removeDuplicateMessages([data], prevMessages)]);
  });
}, [socket]);





  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

 
  return (
    <div className="chat">
      <ChatBar socket={socket} />
      <div className="chat__main">
        <ChatBody messages={messages} lastMessageRef={lastMessageRef} />
        <ChatFooter socket={socket} />
      </div>
    </div>
  );
};

export default ChatPage;