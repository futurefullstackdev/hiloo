# 🔮 Crystal Collectors - Multiplayer Game

A vibrant and exciting multiplayer crystal collection game built with **Phaser.js**, **Socket.IO**, and **Node.js**. Compete with other players in real-time to collect magical crystals and climb the leaderboard!

## ✨ Features

- **Real-time Multiplayer**: Play with multiple players simultaneously
- **5 Crystal Types**: Ruby, Emerald, Sapphire, Diamond, and Amethyst with different values and rarities
- **Vibrant Design**: Beautiful gradient backgrounds, glowing effects, and smooth animations
- **Live Leaderboard**: See how you rank against other players in real-time
- **Smooth Movement**: WASD or Arrow key controls with physics-based movement
- **Visual Effects**: Sparkle effects, collection animations, and pulsing crystals
- **Responsive UI**: Clean, modern interface with notifications and game stats

## 🎮 How to Play

1. Enter your mystical name when prompted
2. Use **WASD** or **Arrow Keys** to move your character
3. Collect crystals to earn points:
   - 🔴 **Ruby**: 10 points (Common)
   - 🟢 **Emerald**: 15 points (Uncommon)
   - 🔵 **Sapphire**: 20 points (Rare)
   - ⚪ **Diamond**: 30 points (Very Rare)
   - 🟣 **Amethyst**: 25 points (Ultra Rare)
4. Compete with other players to top the leaderboard!

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

5. **Share the link** with friends to play together!

### Development Mode

For development with auto-restart:
```bash
npm run dev
```

## 🛠️ Technical Details

### Server Architecture
- **Express.js** server for serving static files
- **Socket.IO** for real-time multiplayer communication
- Game state management with player synchronization
- Anti-cheat distance validation for crystal collection

### Client Features
- **Phaser.js** game engine for smooth 2D graphics
- Real-time player movement synchronization
- Dynamic crystal generation with rarity system
- Particle effects and animations
- Responsive UI with live updates

### Game Mechanics
- **Movement**: Physics-based movement with collision boundaries
- **Crystal Collection**: Proximity-based collection with visual feedback
- **Scoring System**: Different crystal types with varying point values
- **Multiplayer Sync**: Real-time position and score synchronization

## 🎨 Visual Features

- **Animated Background**: Shifting gradient colors
- **Glowing Effects**: Neon borders and text shadows
- **Particle Systems**: Starfield background and sparkle effects
- **Smooth Animations**: Crystal pulsing and collection effects
- **Modern UI**: Glass-morphism design with backdrop filters

## 🌐 Deployment

### Local Network Play
The game works on your local network. Share your IP address:
```
http://YOUR_IP_ADDRESS:3000
```

### Production Deployment
Deploy to platforms like:
- Heroku
- Railway
- Vercel
- DigitalOcean

Make sure to set the `PORT` environment variable for production.

## 🔧 Customization

### Adding New Crystal Types
Edit the `crystalTypes` array in `server.js`:
```javascript
const crystalTypes = [
  { type: 'ruby', value: 10, color: 0xff0066, rarity: 0.3 },
  // Add your new crystal type here
];
```

### Changing Game Settings
Modify game parameters in `server.js`:
```javascript
let gameState = {
  maxCrystals: 15,    // Number of crystals on screen
  gameWidth: 1200,    // Game area width
  gameHeight: 800     // Game area height
};
```

## 📝 License

MIT License - Feel free to use this project for learning or building your own games!

## 🎉 Have Fun!

Enjoy collecting crystals and competing with friends in this magical multiplayer adventure!