# Quick Deployment Guide for Render.com

## 🚀 Fast Deploy (5 minutes)

### Step 1: Prepare Your Files
You should have these files ready:
- `server.js` - Main server file
- `package.json` - Dependencies
- `public/index.html` - Game client
- `.gitignore` - Git ignore rules
- `README.md` - Documentation

### Step 2: Push to GitHub

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial multiplayer game"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Render

1. Go to https://render.com
2. Sign up or log in
3. Click **"New +"** → **"Web Service"**
4. Click **"Connect account"** to connect GitHub
5. Select your repository
6. Render will auto-detect settings, or use these:
   - **Name**: `ai-rooms-game` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Standard for better performance)

7. Click **"Create Web Service"**

### Step 4: Wait for Deployment
- First build takes 2-5 minutes
- You'll get a URL like: `https://ai-rooms-game.onrender.com`
- Share this URL with friends to play!

## 🎮 How to Use

### Create a Room
1. Open the game URL
2. Click **"CREATE ROOM"**
3. Enter your name
4. Share the 6-character room code with friends

### Join a Room
1. Open the game URL
2. Click **"JOIN ROOM"**
3. Enter your name
4. Enter the room code from your friend
5. Click **"JOIN SESSION"**

### Start Playing
1. When all players are ready, the host clicks **"START MISSION"**
2. Use WASD to move, SHIFT to run, SPACE for flashlight
3. Press E to activate terminals (need 3 per level)
4. Press T to chat with teammates
5. Reach the exit portal after collecting all codes!

## ⚠️ Important Notes

### Free Tier Limitations
- Server sleeps after 15 min of inactivity
- First load after sleep takes ~30 seconds
- Good for testing, upgrade for production

### Recommended for Production
- **Starter Plan** ($7/month):
  - No sleep
  - Better performance
  - Custom domain support

### Troubleshooting

**"Cannot connect to server"**
- Wait 30 seconds if server was sleeping
- Check browser console for errors
- Try refreshing the page

**"Room not found"**
- Room codes are case-sensitive
- Rooms expire after 1 hour if empty
- Create a new room

**Game is laggy**
- Too many players (max 8)
- Slow internet connection
- Upgrade to paid Render plan

## 🔧 Configuration

### Change Server URL
If you need to change the server URL, edit `public/index.html` line ~233:
```javascript
const serverUrl = 'https://your-custom-domain.com';
```

### Adjust Player Limit
Edit `server.js` line ~26:
```javascript
this.maxPlayers = 8; // Change to desired limit
```

### Modify Game Settings
All game constants are in `public/index.html`:
- `CELL = 7` - Map cell size
- `MAP_SIZES = [22, 28, 35]` - Level sizes
- `LEVEL_DATA` - Entity counts and colors

## 📊 Monitoring

In Render dashboard you can:
- View server logs
- Monitor resource usage
- See active connections
- Set up custom domains
- Configure environment variables

## 🎉 You're Done!

Your multiplayer game is now live! Share the URL and have fun!

### Next Steps
- Add your custom domain
- Upgrade to paid plan for better performance
- Customize game settings
- Add more levels (edit `LEVEL_DATA`)

---

Need help? Check the main README.md for detailed documentation!
