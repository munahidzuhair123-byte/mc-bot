const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('GuardBot247 is online and watching the server!'));
app.listen(3000, () => console.log('Keep-alive web server running on port 3000'));

function startBot() {
  const bot = mineflayer.createBot({
    host: 'blockyharbor726.mcsh.gg',
    port: 25565,
    username: 'GuardBot247',
    version: false
  });

  // Makes the bot jump and look around every 15 seconds so it acts like a real player
  bot.on('spawn', () => {
    console.log('Bot successfully joined blockyharbor726.mcsh.gg!');
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
      bot.look(Math.random() * 3, 0);
    }, 15000);
  });

  // Auto-reconnects every 10 seconds if the server is still in queue or restarts
  bot.on('end', () => {
    console.log('Disconnected. Retrying in 10 seconds...');
    setTimeout(startBot, 10000);
  });

  bot.on('kicked', (reason) => console.log('Kicked from server:', reason));
  bot.on('error', (err) => console.log('Connection status:', err.message));
}

startBot();

