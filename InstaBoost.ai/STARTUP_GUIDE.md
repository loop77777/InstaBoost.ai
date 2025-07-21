# 🚀 InstaBoost.ai - Project Startup Guide

## 📋 Prerequisites
Before starting, ensure you have:
- **Node.js** (v16+): [Download here](https://nodejs.org/)
- **MongoDB**: [Local installation](https://www.mongodb.com/try/download/community) or [MongoDB Atlas](https://cloud.mongodb.com/)
- **Expo CLI**: Install with `npm install -g @expo/cli`
- **Git**: [Download here](https://git-scm.com/)

## 🔑 Required API Keys
Sign up for these services and get your API keys:

### 1. **OpenAI** (Required for AI features)
- Visit: https://platform.openai.com/
- Generate API key
- Add to `server/.env` as `OPENAI_API_KEY`

### 2. **Instagram Graph API** (Core functionality)
- Visit: https://developers.facebook.com/
- Create Facebook App
- Enable Instagram Graph API
- Add App ID and Secret to environment files

### 3. **Stripe** (Payment processing)
- Visit: https://stripe.com/
- Get publishable and secret keys
- Add webhook endpoint: `your-domain.com/api/subscriptions/webhook`

### 4. **Spotify Web API** (Optional - for trending audio)
- Visit: https://developer.spotify.com/
- Create app and get credentials

## 🛠️ Installation Steps

### **Step 1: Install Server Dependencies**
```bash
cd "c:\Users\Asus\Desktop\InstaAI Boost\InstaBoost_AI_Boilerplate\InstaBoost.ai\server"
npm install
```

### **Step 2: Install Client Dependencies**
```bash
cd "..\client"
npm install
```

### **Step 3: Install Automation Scripts Dependencies**
```bash
cd "..\scripts"
npm install
```

### **Step 4: Configure Environment Variables**
1. **Server Environment**: Edit `server/.env` with your API keys
2. **Client Environment**: Edit `client/.env` with frontend configuration
3. **Database**: Set your MongoDB connection string

### **Step 5: Database Setup**
If using local MongoDB:
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or start manually
mongod --dbpath "C:\data\db"
```

### **Step 6: Start Development Servers**

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```
*Server will start on http://localhost:3000*

**Terminal 2 - React Native App:**
```bash
cd client
npm start
```
*Expo development server will start*

**Terminal 3 - Automation Scripts (Optional):**
```bash
cd scripts
npm start
```

## 📱 Running the App

### **Option 1: Expo Go App (Recommended for testing)**
1. Install **Expo Go** app on your phone
2. Scan QR code from Expo CLI
3. App will load on your device

### **Option 2: Android/iOS Simulator**
1. Install Android Studio or Xcode
2. Run `npm run android` or `npm run ios` in client directory

## 🔧 Configuration Guide

### **MongoDB Setup Options:**

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/instaboost
```

**MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/instaboost
```

### **Instagram API Setup:**
1. Create Facebook Developer Account
2. Create new app with Instagram Graph API
3. Add Instagram Test Users
4. Configure OAuth redirect URLs
5. Add App ID to both server and client `.env` files

### **Stripe Webhook Configuration:**
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/subscriptions/webhook
   ```
3. Add webhook signing secret to `server/.env`

## 🎯 Feature Testing Guide

### **1. AI Caption Generation**
- Navigate to Caption Generator
- Upload image or enter topic
- Test AI generation with different tones

### **2. Analytics Dashboard**
- View follower growth charts
- Test engagement metrics
- Check post performance data

### **3. Content Calendar**
- Create scheduled posts
- Test drag & drop functionality
- Preview content in calendar view

### **4. Reel Editor**
- Import video content
- Add text overlays and music
- Test export functionality

### **5. Premium Features**
- Test subscription flow
- Verify credit system
- Check marketplace functionality

## 🚀 Deployment Options

### **Development:**
- Local development server
- Expo Go for mobile testing

### **Production:**
- **Backend**: Deploy to Heroku, AWS, or DigitalOcean
- **Frontend**: Build with `expo build` and deploy to app stores
- **Database**: Use MongoDB Atlas for production

## 📞 Support & Troubleshooting

### **Common Issues:**

**1. Metro bundler issues:**
```bash
cd client
npx expo start --clear
```

**2. Node modules conflicts:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**3. Environment variables not loading:**
- Restart Expo development server
- Check `.env` file formatting
- Ensure no trailing spaces

**4. API connection errors:**
- Verify server is running on port 3000
- Check firewall settings
- Confirm API_URL in client `.env`

### **Development Commands:**

**Server:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

**Client:**
```bash
npm start        # Start Expo development server
npm run android  # Run on Android
npm run ios      # Run on iOS
npm run web      # Run in web browser
```

## 🎉 You're Ready!

Your InstaBoost.ai platform is now configured with:
- ✅ AI-powered caption generation
- ✅ Advanced analytics dashboard
- ✅ Content calendar with scheduling
- ✅ Professional reel editor
- ✅ Influencer marketplace
- ✅ Subscription management
- ✅ Credit-based AI system
- ✅ Growth automation tools

**Happy growing! 📈✨**
