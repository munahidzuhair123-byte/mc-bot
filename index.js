const mc = require('minecraft-protocol');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('GuardBot247 is online and registered!'));
app.listen(3000, () => console.log('Keep-alive web server running on port 3000'));

function startBot() {
  const client = mc.createClient({
    host: 'blockyharbor726.mcsh.gg',
    port: 25565,
    username: 'mushahidafkpc',
    version: '26.1',
    auth: 'offline'
  });

  let swingTimer;
  let loggedInSent = false;

  function triggerLogin() {
    if (loggedInSent) return;
    loggedInSent = true;
    setTimeout(() => {
      try {
        if (typeof client.chat === 'function') {
          client.chat('/login 12345678');
        } else {
          client.write('chat_command_signed', {
            command: 'login 12345678',
            timestamp: BigInt(Date.now()),
            salt: 0n,
            argumentSignatures: [],
            messageCount: 0,
            acknowledged: Buffer.alloc(3)
          });
        }
        console.log('Login command sent!');
      } catch (err) {
        console.log('Login send error:', err.message);
      }
    }, 3000);
  }

  client.on('player_position', (packet) => {
    if (packet.teleportId !== undefined) {
      client.write('teleport_confirm', { teleportId: packet.teleportId });
    }
    triggerLogin();
  });

  client.on('login', () => {
    console.log('Bot successfully joined blockyharbor726.mcsh.gg!');
    triggerLogin();

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
