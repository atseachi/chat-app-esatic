import React, { useState } from 'react';

// Le composant ChatFooter prend une propriété socket comme paramètre
const ChatFooter = ({ socket }) => {
  // Utilisation du hook d'état pour suivre le contenu du message
  const [message, setMessage] = useState("");

  // Fonction appelée lorsqu'un utilisateur commence à taper
  const handleTyping = () => socket.emit("typing", `${localStorage.getItem("userName")} is typing`);

  // Fonction appelée lorsqu'un utilisateur envoie un message
  const handleSendMessage = (e) => {
    e.preventDefault();

    // Vérification du message non vide et de la présence d'un nom d'utilisateur dans le stockage local
    if (message.trim() && localStorage.getItem("userName")) {
      // Émission de l'événement 'message' avec le contenu du message et l'expéditeur au serveur
      socket.emit("message", {
        content: message,
        sender: localStorage.getItem("userName"),
        id: `${socket.id}${Math.random()}`, // Génération d'un identifiant unique pour le message
        socketID: socket.id
      });
    }

    // Réinitialisation du champ de saisie après l'envoi du message
    setMessage("");
  };

  // Rendu du composant
  return (
    <div className='chat__footer'>
      <form className='form' onSubmit={handleSendMessage}>
        {/* Champ de saisie du message */}
        <input
          type="text"
          placeholder='Write message'
          className='message'
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleTyping} // Déclenche l'événement de saisie lorsqu'une touche est enfoncée
        />
        
        {/* Bouton d'envoi du message */}
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

// Exportation du composant ChatFooter
export default ChatFooter;
