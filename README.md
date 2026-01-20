# Security Awareness Demo

An educational tool to demonstrate browser permission risks to students. Shows what data websites can collect when users grant camera, microphone, and location permissions.

## Features

- **Demo Page**: Requests camera, mic, and GPS permissions from visitors
- **Admin Dashboard**: View all collected data at `/admin`
- **Session Control**: Start/stop demo sessions with one click
- **Real-time Updates**: Dashboard auto-refreshes every 10 seconds
- **Camera Snapshots**: Captures up to 3 photos when camera is granted
- **Location Mapping**: Direct links to Google Maps for collected coordinates

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env

# 3. Edit .env with your credentials
nano .env

# 4. Start server
npm start
```

Server runs at `http://localhost:3000`

## Default Credentials

- **Admin URL**: `/admin`
- **Username**: `admin`
- **Password**: `security123`

**Change these in `.env` for production!**

## Free Hosting Options (HTTPS Required)

Camera and location permissions require HTTPS. Here are free hosting platforms:

### 1. Render.com (Recommended)
- Sign up at https://render.com
- Create "New Web Service"
- Connect your GitHub repo
- Set environment variables in dashboard
- Free tier includes HTTPS

### 2. Railway.app
- Sign up at https://railway.app
- Create new project from GitHub
- Add environment variables
- Free tier with $5 credit/month

### 3. Glitch.com
- Go to https://glitch.com
- Click "New Project" > "Import from GitHub"
- Add `.env` file with your credentials
- Instant HTTPS URL

### 4. Cyclic.sh
- Sign up at https://cyclic.sh
- Connect GitHub repo
- Set environment variables
- Free tier with HTTPS

### 5. Fly.io
- Install flyctl CLI
- Run `fly launch`
- Set secrets: `fly secrets set ADMIN_PASS=yourpass`
- Free tier available

## How to Use in Class

1. **Before Class**:
   - Deploy to a hosting platform
   - Test the demo URL works
   - Login to admin and verify dashboard

2. **During Class**:
   - Share the demo URL with students
   - Ask them to click "Allow" on permissions
   - Show the admin dashboard on screen
   - Discuss what data was collected

3. **Discussion Points**:
   - Why did you click "Allow"?
   - What could a malicious site do with this data?
   - How can you protect yourself?
   - When should you grant permissions?

4. **After Demo**:
   - Click "Stop Demo" to close the session
   - Click "Clear Data" to remove all collected info

## Data Collected

| Permission | Data |
|------------|------|
| Always | IP, User Agent, Device info, Screen size, Timezone |
| Camera | Webcam snapshots |
| Microphone | Device count (no audio recorded) |
| Location | GPS coordinates, accuracy |

## Security Notes

- Data is stored in memory only (lost on restart)
- No data is sent to third parties
- Camera snapshots are low quality (0.5 JPEG)
- Audio is NOT recorded (only device enumeration)

## License

MIT - For educational purposes only
