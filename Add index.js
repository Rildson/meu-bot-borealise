const express = require('express');
const { io } = require('socket.io-client');
const app = express();

app.get('/', (req, res) => res.send('Bot Online - Woot + Fila Ativados'));
app.listen(process.env.PORT || 10000);

const socket = io('https://prod.borealise.com', {
  path: '/ws',
  transports: ['websocket'],
  auth: { token: process.env.BOREALISE_TOKEN }
});

// Função para votar e entrar na fila
const participar = () => {
  console.log('🎵 Música nova: Votando Woot...');
  socket.emit('room:vote', { direction: 1 }); // Dá o Woot
  
  console.log('🎧 Tentando entrar na fila de DJ...');
  socket.emit('room:queue:join'); // Comando para entrar na fila
};

socket.on('connect', () => {
  console.log('🚀 Conectado! Entrando na sala e na fila...');
  socket.emit('room:join', { slug: 'mib' }); // Entra na sala
  socket.emit('room:queue:join'); // Entra na fila assim que logar
});

// Toda vez que a música mudar, ele vota e reforça o pedido para entrar na fila
socket.on('advance', () => {
  participar();
});

socket.on('connect_error', (err) => {
  console.log('⚠️ Erro: ' + err.message);
});
