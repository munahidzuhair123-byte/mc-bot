const mc = require('minecraft-protocol');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('GuardBot247 is online and spinning 360 degrees!'));
app.listen(3000, () => console.log('Keep-alive web server running on port 3000'));

function startBot() {
  const client = mc.createClient({
    host: 'blockyharbor726.mcsh.gg',
    port: 25565,
    username: 'GuardBot247',
    version: '1.21.4',
    auth: 'offline'
  });

  let spinTimer;
  let yaw = 0;
  let tickCount = 0;

  client.on('login', () => {
    console.log('Bot successfully joined blockyharbor726.mcsh.gg and is spinning 360 degrees!');
    
    // Rotates smoothly 15 degrees every 0.5 seconds (full 360-degree spin every 12 seconds)
    spinTimer = setInterval(() => {
      yaw = (yaw + 15) % 360;
      tickCount++;

      client.write('look', {
        yaw: yaw,
        pitch: 0,
        onGround: true
      });

      // Swings right arm every 5 seconds while spinning
      if (tickCount % 10 === 0) {
        client.write('arm_animation', { hand: 0 });
      }
    }, 500);
  });

  client.on('kick_disconnect', (packet) => {
    console.log('Kicked from server:', packet.reason);
  });

  client.on('disconnect', (packet) => {
    console.log('Disconnected:', packet.reason);
  });

  client.on('end', () => {
    clearInterval(spinTimer);
    console.log('Connection closed. Retrying in 15 seconds...');
    setTimeout(startBot, 15000);
  });

  client.on('error', (err) => {
    console.log('Connection status:', err.message);
  });
}

startBot();
