const express = require('express');
const { io } = require('socket.io-client');
const app = express();

// Mantém o servidor do Render vivo
const PORT = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Bot Online - Fila de DJ Ativada'));
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

const socket = io('https://prod.borealise.com', {
  path: '/ws',
  transports: ['polling', 'websocket'], // Polling ajuda a evitar o "websocket error"
  auth: { token: process.env.BOREALISE_TOKEN }
});

// Função apenas para entrar na fila
const entrarNaFila = () => {
  console.log('🎧 Tentando entrar na fila de DJ...');
  socket.emit('room:queue:join'); // Comando para virar DJ
};

socket.on('connect', () => {
  console.log('🚀 Conectado no Render! Entrando na sala e na fila...');
  socket.emit('room:join', { slug: 'mib' }); // Entra na sala mib
  entrarNaFila();
});

// Quando a música mudar, ele garante que você continue na fila ou tente entrar
socket.on('advance', () => {
  entrarNaFila();
});

socket.on('connect_error', (err) => {
  console.log('⚠️ Erro de conexão: ' + err.message); // Onde aparece o websocket error
});
