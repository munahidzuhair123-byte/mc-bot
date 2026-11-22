const mc = require('minecraft-protocol');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('GuardBot247 is online and watching the server!'));
app.listen(3000, () => console.log('Keep-alive web server running on port 3000'));

function startBot() {
  const client = mc.createClient({
    host: 'blockyharbor726.mcsh.gg',
    port: 25565,
    username: 'GuardBot247',
    version: '1.21.4',
    auth: 'offline'
  });

  client.on('login', () => {
    console.log('Bot successfully joined blockyharbor726.mcsh.gg and will stay online!');
  });

  client.on('kick_disconnect', (packet) => {
    console.log('Kicked from server:', packet.reason);
  });

  client.on('disconnect', (packet) => {
    console.log('Disconnected:', packet.reason);
  });

  client.on('end', () => {
    console.log('Connection closed. Retrying in 15 seconds...');
    setTimeout(startBot, 15000);
  });

  client.on('error', (err) => {
    console.log('Connection status:', err.message);
  });
}

startBot();
