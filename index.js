const express = require('express');
const { io } = require('socket.io-client');
const app = express();

// CORREÇÃO PARA O RENDER: O servidor precisa dessa porta para não dar erro de "Deploy"
const PORT = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Bot Online - Woot + Fila Ativados'));
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

const socket = io('https://prod.borealise.com', {
  path: '/ws',
  transports: ['websocket'],
  auth: { token: process.env.BOREALISE_TOKEN } // Pega o token da variável que você configurou
});

// Função para votar Woot e entrar na fila
const participar = () => {
  console.log('🎵 Música nova: Votando Woot...');
  socket.emit('room:vote', { direction: 1 }); // Dá o voto positivo
  
  console.log('🎧 Tentando entrar na fila de DJ...');
  socket.emit('room:queue:join'); // Entra na fila automaticamente
};

socket.on('connect', () => {
  console.log('🚀 SUCESSO! Conectado no Render.');
  socket.emit('room:join', { slug: 'mib' }); // Entra na sala mib
  socket.emit('room:queue:join'); // Tenta entrar na fila logo ao logar
});

// Toda vez que a música mudar (advance), ele vota e reforça a fila
socket.on('advance', () => {
  participar();
});

socket.on('connect_error', (err) => {
  console.log('⚠️ Erro de conexão: ' + err.message);
});
