const express = require('express');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;
const ChatModel = require('./models/ChatModels');
const UserModel = require('./models/UserModels');
const RoomModel = require('./models/RoomModels');

var User = mongoose.model('user');
var Room = mongoose.model('room');
var Chat = mongoose.model('chat')

const app = express();
const PORT = 4000;


// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/chatSocket', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Vérification de la connexion à MongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
db.once('open', () => {
  console.log('Connecté à MongoDB');
});




//New imports
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

//Add this before the app.get() block
let users = [];

socketIO.on('connection', (socket) => {



  socket.on('pseudo', async (pseudo) => {
    try {
      const user = await User.findOne({ pseudo: pseudo });
  
      if (user) {
        socket.pseudo = pseudo;
        socket.broadcast.emit('newUser', pseudo);
        console.log('Utilisateur existant');
      } else {
        const newUser = new User({ pseudo: pseudo });
        await newUser.save();
  
        socket.pseudo = pseudo;
        socket.broadcast.emit('newUser', pseudo);
        console.log('Nouvel utilisateur ajouté');
      }
      users.push(pseudo);
      
      socketIO.emit('newUserResponse', users);
      console.log(`⚡: ${socket.id} user just connected!`);


      //recuperations des anciens messages
      Chat.find()
      .then((messages) => {
      socket.emit('oldMessages', messages);
     })
    .catch((err) => {
    console.error(err);
    });
      

    } catch (err) {
      // Gérer l'erreur ici
      console.error(err);
    }
  });
  
  
 
  socket.on('message', (message) => {
    console.log('New message received on server:', message);
    const chat = new Chat();
    chat.content = message.content;
    chat.sender = message.sender;
    chat.save();

    socketIO.emit('messageResponse', message);
  });

  socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));







  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    //Updates the list of users when a user disconnects from the server
    users = users.filter((user) => user !== socket.pseudo);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit('newUserResponse', users);
    socket.disconnect();
  });
});
  

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});