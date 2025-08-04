const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Game state
let gameState = {
  players: {},
  crystals: [],
  gameStarted: false,
  maxCrystals: 15,
  gameWidth: 1200,
  gameHeight: 800
};

// Crystal types with different values and colors
const crystalTypes = [
  { type: 'ruby', value: 10, color: 0xff0066, rarity: 0.3 },
  { type: 'emerald', value: 15, color: 0x00ff66, rarity: 0.25 },
  { type: 'sapphire', value: 20, color: 0x0066ff, rarity: 0.2 },
  { type: 'diamond', value: 30, color: 0xffffff, rarity: 0.15 },
  { type: 'amethyst', value: 25, color: 0x9966ff, rarity: 0.1 }
];

// Generate random crystals
function generateCrystal() {
  const rand = Math.random();
  let cumulativeRarity = 0;
  let selectedType = crystalTypes[0];
  
  for (let crystal of crystalTypes) {
    cumulativeRarity += crystal.rarity;
    if (rand <= cumulativeRarity) {
      selectedType = crystal;
      break;
    }
  }
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    x: Math.random() * (gameState.gameWidth - 100) + 50,
    y: Math.random() * (gameState.gameHeight - 100) + 50,
    type: selectedType.type,
    value: selectedType.value,
    color: selectedType.color,
    collected: false,
    pulsePhase: Math.random() * Math.PI * 2
  };
}

// Initialize crystals
function initializeCrystals() {
  gameState.crystals = [];
  for (let i = 0; i < gameState.maxCrystals; i++) {
    gameState.crystals.push(generateCrystal());
  }
}

// Generate player colors
function generatePlayerColor() {
  const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0xf0932b, 0xeb4d4b, 0x6c5ce7, 0xa29bfe];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New player connected:', socket.id);

  // Handle player joining
  socket.on('join-game', (playerName) => {
    gameState.players[socket.id] = {
      id: socket.id,
      name: playerName || `Player ${Object.keys(gameState.players).length + 1}`,
      x: Math.random() * (gameState.gameWidth - 100) + 50,
      y: Math.random() * (gameState.gameHeight - 100) + 50,
      score: 0,
      color: generatePlayerColor(),
      speed: 200,
      lastUpdate: Date.now()
    };

    // Start game if this is the first player
    if (!gameState.gameStarted && Object.keys(gameState.players).length === 1) {
      gameState.gameStarted = true;
      initializeCrystals();
    }

    // Send initial game state to new player
    socket.emit('game-state', gameState);
    
    // Broadcast new player to all other players
    socket.broadcast.emit('player-joined', gameState.players[socket.id]);
    
    console.log(`${gameState.players[socket.id].name} joined the game`);
  });

  // Handle player movement
  socket.on('player-move', (movement) => {
    if (gameState.players[socket.id]) {
      const player = gameState.players[socket.id];
      const now = Date.now();
      const deltaTime = (now - player.lastUpdate) / 1000;
      
      // Update player position with bounds checking
      player.x = Math.max(25, Math.min(gameState.gameWidth - 25, movement.x));
      player.y = Math.max(25, Math.min(gameState.gameHeight - 25, movement.y));
      player.lastUpdate = now;
      
      // Broadcast movement to all other players
      socket.broadcast.emit('player-moved', {
        id: socket.id,
        x: player.x,
        y: player.y
      });
    }
  });

  // Handle crystal collection
  socket.on('collect-crystal', (crystalId) => {
    const crystal = gameState.crystals.find(c => c.id === crystalId && !c.collected);
    const player = gameState.players[socket.id];
    
    if (crystal && player) {
      // Check distance to prevent cheating
      const distance = Math.sqrt(
        Math.pow(player.x - crystal.x, 2) + Math.pow(player.y - crystal.y, 2)
      );
      
      if (distance <= 40) { // Collection radius
        crystal.collected = true;
        player.score += crystal.value;
        
        // Broadcast crystal collection
        io.emit('crystal-collected', {
          crystalId: crystalId,
          playerId: socket.id,
          playerName: player.name,
          value: crystal.value,
          newScore: player.score
        });
        
        // Generate new crystal after a short delay
        setTimeout(() => {
          const newCrystal = generateCrystal();
          gameState.crystals = gameState.crystals.filter(c => c.id !== crystalId);
          gameState.crystals.push(newCrystal);
          io.emit('new-crystal', newCrystal);
        }, 1000);
      }
    }
  });

  // Handle player disconnect
  socket.on('disconnect', () => {
    if (gameState.players[socket.id]) {
      console.log(`${gameState.players[socket.id].name} disconnected`);
      delete gameState.players[socket.id];
      socket.broadcast.emit('player-left', socket.id);
    }
  });
});

// Game loop for crystal animations
setInterval(() => {
  gameState.crystals.forEach(crystal => {
    crystal.pulsePhase += 0.1;
  });
  io.emit('crystal-pulse-update', gameState.crystals.map(c => ({
    id: c.id,
    pulsePhase: c.pulsePhase
  })));
}, 100);

// Serve the main game page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`🎮 Crystal Collectors server running on port ${PORT}`);
  console.log(`🌟 Open http://localhost:${PORT} to play!`);
});