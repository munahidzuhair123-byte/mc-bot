const mc = require('minecraft-protocol');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('GuardBot247 is online and registered!'));
app.listen(3000, () => console.log('Keep-alive web server running on port 3000'));

function startBot() {
  const client = mc.createClient({
    host: 'blockyharbor726.mcsh.gg',
    port: 25565,
    username: 'GuardBot247',
    version: '1.21.4',
    auth: 'offline'
  });

  let swingTimer;

  client.on('position', (packet) => {
    if (packet.teleportId !== undefined) {
      client.write('teleport_confirm', { teleportId: packet.teleportId });
    }
  });

  client.on('login', () => {
    console.log('Bot successfully joined blockyharbor726.mcsh.gg!');

    client.write('settings', {
      locale: 'en_US',
      viewDistance: 4,
      chatFlags: 0,
      chatColors: true,
      skinParts: 127,
      mainHand: 1,
      enableTextFiltering: false,
      enableServerListing: true,
      particleStatus: 0
    });

    // Sends /register <pass> <confirmPass> after 3s, then /login <pass> after 5s
    setTimeout(() => {
      client.chat('/register BotPass12345! BotPass12345!');
    }, 3000);

    setTimeout(() => {
      client.chat('/login BotPass12345!');
    }, 5000);

    // Swings right arm every 10 seconds
    swingTimer = setInterval(() => {
      client.write('arm_animation', { hand: 0 });
    }, 10000);
  });

  client.on('kick_disconnect', (packet) => {
    console.log('Kicked from server:', packet.reason);
  });

  client.on('disconnect', (packet) => {
    console.log('Disconnected:', packet.reason);
  });

  client.on('end', () => {
    clearInterval(swingTimer);
    console.log('Connection closed. Retrying in 15 seconds...');
    setTimeout(startBot, 15000);
  });

  client.on('error', (err) => {
    console.log('Connection status:', err.message);
  });
}

startBot();
