import React, { useState, useEffect } from 'react';
import logo from '../logo.png';

const ChatBar = ({ socket }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on('newUserResponse', (data) => setUsers(data));
  }, [socket, users]);

  return (
    <div className="chat__sidebar">
      <div className="logo-titre">
        <img src={logo} alt="ThreadThrive Logo" className="logo" />
        <h2>ThreadThrive</h2>
      </div>
      <div>
        <h4 className="chat__header">En ligne</h4>
        <div className="chat__users">
          {users.map((user) => (
            <p >{user}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;