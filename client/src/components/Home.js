import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Composant fonctionnel Home avec une propriété socket
const Home = ({ socket }) => {
  // Utilisation du hook useNavigate pour la navigation programmable
  const navigate = useNavigate();
  
  // Utilisation du hook d'état pour suivre le nom d'utilisateur
  const [userName, setUserName] = useState('');

  // Fonction appelée lors de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    // Stockage du nom d'utilisateur dans le stockage local
    localStorage.setItem('userName', userName);

    // Émission de l'événement 'pseudo' au serveur avec le nom d'utilisateur
    socket.emit('pseudo', userName);

    // Navigation vers la page de chat
    navigate('/chat');
  };

  // Rendu du composant
  return (
    <form className="home__container" onSubmit={handleSubmit}>
      {/* Titre de la page d'accueil */}
      <h2 className="home__header">Sign in to Open Chat</h2>

      {/* Champ de saisie pour le nom d'utilisateur */}
      <label htmlFor="username">Username</label>
      <input
        type="text"
        minLength={6}
        name="username"
        id="username"
        className="username__input"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      {/* Bouton pour soumettre le formulaire */}
      <button className="home__cta">SIGN IN</button>
    </form>
  );
};

// Exportation du composant Home
export default Home;
