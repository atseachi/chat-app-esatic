import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatBody = ({ messages, lastMessageRef }) => {
  const navigate = useNavigate();

  const handleLeaveChat = () => {
    localStorage.removeItem('userName');
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <header className="chat__mainHeader">
        <p>Discussion de groupe</p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          Déconnexion
        </button>
      </header>

      <div className="message__container">
        {messages.map((message) =>
          message.sender === localStorage.getItem('userName') ? (
            <div className="message__chats" key={message.id}>
              <p className="sender__name">You</p>
              <div className="message__sender">
                <p>{message.content}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              <p>{message.sender}</p>
              <div className="message__recipient">
                <p>{message.content}</p>
              </div>
            </div>
          )
        )}

     
        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;