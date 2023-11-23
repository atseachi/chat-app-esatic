// Importation des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const http = require('http').Server(app);
const cors = require('cors');
const socketIO = require('socket.io')(http);
const ObjectId = mongoose.Types.ObjectId;
const ChatModel = require('./models/ChatModels');
const UserModel = require('./models/UserModels');
const RoomModel = require('./models/RoomModels');

// Définition des modèles MongoDB
var User = mongoose.model('user');
var Room = mongoose.model('room');
var Chat = mongoose.model('chat');

// Initialisation d'Express
const app = express();
const PORT = 4000;

// Activation du middleware CORS pour permettre les requêtes cross-origin
app.use(cors());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/chatSocket', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Gestion des erreurs et confirmation de la connexion à MongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
db.once('open', () => {
  console.log('Connecté à MongoDB');
});

// Configuration de Socket.IO pour accepter les connexions
socketIO.on('connection', (socket) => {
  // ...

  // Gestion de l'événement 'pseudo' lorsqu'un utilisateur se connecte
  socket.on('pseudo', async (pseudo) => {
    try {
      // Recherche de l'utilisateur dans la base de données
      const user = await User.findOne({ pseudo: pseudo });
  
      // Vérification de l'existence de l'utilisateur
      if (user) {
        socket.pseudo = pseudo;
        socket.broadcast.emit('newUser', pseudo);
        console.log('Utilisateur existant');
      } else {
        // Création d'un nouvel utilisateur s'il n'existe pas
        const newUser = new User({ pseudo: pseudo });
        await newUser.save();
  
        socket.pseudo = pseudo;
        socket.broadcast.emit('newUser', pseudo);
        console.log('Nouvel utilisateur ajouté');
      }
      // Ajout du pseudo à la liste des utilisateurs
      users.push(pseudo);
      
      // Émission de la liste des utilisateurs à tous les clients
      socketIO.emit('newUserResponse', users);
      console.log(`⚡: ${socket.id} user just connected!`);

      // Récupération des anciens messages depuis la base de données
      Chat.find()
        .then((messages) => {
          socket.emit('oldMessages', messages);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      // Gestion de l'erreur en cas de problème avec la base de données
      console.error(err);
    }
  });

  // ...

  // Gestion de l'événement 'message' lorsqu'un message est envoyé
  socket.on('message', (message) => {
    console.log('New message received on server:', message);
    // Création d'un nouveau message et sauvegarde dans la base de données
    const chat = new Chat();
    chat.content = message.content;
    chat.sender = message.sender;
    chat.save();

    // Émission du message à tous les clients
    socketIO.emit('messageResponse', message);
  });

  // Gestion de l'événement 'typing' pour indiquer qu'un utilisateur est en train de taper
  socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

  // Gestion de l'événement 'disconnect' lorsqu'un utilisateur se déconnecte
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    // Mise à jour de la liste des utilisateurs après la déconnexion
    users = users.filter((user) => user !== socket.pseudo);
    // Émission de la liste mise à jour à tous les clients
    socketIO.emit('newUserResponse', users);
    // Déconnexion du socket
    socket.disconnect();
  });
});

// Définition d'une route API simple
app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

// Démarrage du serveur sur le port spécifié
http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
