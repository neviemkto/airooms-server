# AI ROOMS - Multiplayer Horror Escape Game

A real-time multiplayer 3D horror escape game built with WebGL, Socket.IO, and Node.js.

## Features

- **Real-time Multiplayer**: Play with up to 8 players simultaneously
- **Room System**: Create or join game rooms with unique codes
- **3 Levels**: Progress through increasingly difficult levels together
- **Player Models**: Each player has a unique colored character model
- **Live Chat**: Communicate with other players using the in-game chat (Press T)
- **Synchronized Gameplay**: All terminals, level progression, and player positions are synchronized
- **Spectator Support**: See other players' positions and actions in real-time

## How to Play

### Controls
- **WASD**: Move around
- **SHIFT**: Sprint/Overclock
- **SPACE**: Toggle flashlight
- **E**: Interact with terminals and exits
- **T**: Open/close chat
- **Mouse**: Look around

### Objective
- Find and activate 3 terminals in each level
- Once all 3 terminals are activated, proceed to the exit portal
- Complete all 3 levels to win
- Avoid the entities that hunt you!

## Deployment to Render.com

### Prerequisites
- A GitHub account
- A Render.com account (free tier works)

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. In your local project folder, run:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [Render.com](https://render.com) and sign in
2. Click **"New +"** and select **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: ai-rooms-multiplayer (or any name you prefer)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)

5. Click **"Create Web Service"**

### Step 3: Environment Configuration

Render will automatically:
- Install dependencies from package.json
- Run the server on the assigned port
- Provide you with a public URL

Your game will be live at: `https://your-service-name.onrender.com`

### Important Notes

- **Free Tier Limitations**: 
  - The service will spin down after 15 minutes of inactivity
  - First connection after inactivity may take 30-60 seconds
  - Consider upgrading to a paid plan for production use

- **Custom Domain**: You can add a custom domain in Render's settings

- **Environment Variables**: If needed, add them in the Render dashboard under "Environment"

## Local Development

### Installation

```bash
npm install
```

### Running Locally

```bash
npm start
```

The server will start on `http://localhost:3000`

### Development Mode (with auto-reload)

```bash
npm run dev
```

## Technical Details

### Server Architecture
- **Express.js**: Web server and static file serving
- **Socket.IO**: Real-time bidirectional communication
- **Room Management**: Automatic room creation, player tracking, and cleanup

### Client Architecture
- **WebGL**: Custom 3D rendering engine
- **Procedural Generation**: Random maze generation for each level
- **Entity System**: Multiple AI enemy types with different behaviors
- **Audio System**: Web Audio API for sound effects and ambient audio

### Multiplayer Features
- **Position Synchronization**: 20 updates per second
- **State Management**: Server-authoritative game state
- **Lobby System**: Room creation with shareable codes
- **Player Identification**: Unique colors and names
- **Chat System**: Text-based communication
- **Level Progression**: Synchronized level transitions

## Game Entities

### Level 0: The Lobby
- **Stalker**: Follows you but stops when you shine light on it

### Level 1: The Poolrooms
- **Blinker**: Teleports closer every few seconds

### Level 2: Runoff Vault
- **Observer**: Constantly pursues you - keep moving!

## Troubleshooting

### Connection Issues
- Ensure your firewall allows WebSocket connections
- Check that the server URL is correct in the client
- Try refreshing the page

### Performance Issues
- Lower the number of players in the room
- Close other browser tabs
- Ensure you have a stable internet connection

### Room Not Found
- Double-check the room code (6 characters)
- The room may have expired if empty for over 1 hour
- Create a new room instead

## Future Enhancements

Potential features to add:
- Voice chat integration
- More levels and entities
- Power-ups and items
- Player statistics and leaderboards
- Spectator mode for eliminated players
- Mobile touch controls
- VR support

## Credits

Original single-player game concept enhanced with multiplayer capabilities.

## License

MIT License - Feel free to modify and distribute!

---

**Enjoy the game and good luck escaping!** 🎮👻
