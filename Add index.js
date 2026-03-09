const express = require('express');
const { io } = require('socket.io-client');
const app = express();

app.get('/', (req, res) => res.send('Bot Online 24h'));
app.listen(process.env.PORT || 10000);

const socket = io('https://prod.borealise.com', {
  path: '/ws',
  transports: ['websocket'],
  auth: { token: process.env.BOREALISE_TOKEN }
});

socket.on('connect', () => {
  console.log('🚀 SUCESSO! Conectado no Render.');
  socket.emit('room:join', { slug: 'mib' });
});

socket.on('advance', () => {
  socket.emit('room:vote', { direction: 1 });
});
