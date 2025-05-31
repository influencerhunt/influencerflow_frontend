# YouTube Analytics Dashboard

This project now includes a comprehensive YouTube Analytics dashboard that connects to real YouTube API endpoints via **Next.js API routes** that proxy your Python backend service.

## 🏗️ **Architecture**

```
Frontend Components → Next.js API Routes → Python Backend → YouTube API
```

**Benefits of this architecture:**
- ✅ **No CORS issues** - All API calls are server-side
- ✅ **Better security** - API keys stay on the server
- ✅ **Simplified frontend** - Clean API endpoints
- ✅ **Error handling** - Centralized error management
- ✅ **Type safety** - Full TypeScript support

## Features

### 🎯 Complete Analytics Suite
- **Channel Analytics**: Subscriber count, total views, video count, and growth metrics
- **Video Analytics**: Individual video performance, engagement rates, and detailed metrics
- **Comment Analytics**: Sentiment analysis, top commentors, and engagement patterns
- **Engagement Metrics**: Performance tracking, competitive analysis, and optimization recommendations

### 🚀 Next.js API Integration
- All components now connect to Next.js API routes (`/api/youtube/*`) instead of directly calling the Python backend
- **Smart Channel Resolution**: Use friendly channel names (like "mkbhd", "@mkbhd", "Marques Brownlee") instead of complex YouTube channel IDs
- **Automatic ID Resolution**: The system automatically converts channel names to IDs behind the scenes
- **Real-time Data**: All metrics are fetched from actual YouTube API endpoints
- **Error Handling**: Comprehensive error handling with user-friendly messages

### 📡 **API Endpoints**

| Next.js Route | Python Backend | Description |
|---------------|----------------|-------------|
| `/api/youtube/channel-id` | `/api/v1/monitor/youtube/channel-id` | Convert channel name to ID |
| `/api/youtube/stats` | `/api/v1/monitor/youtube/stats` | Channel statistics |
| `/api/youtube/analytics/channel` | `/api/v1/monitor/youtube/analytics/channel` | Channel analytics |
| `/api/youtube/videos` | `/api/v1/monitor/youtube/videos` | Channel videos |
| `/api/youtube/video-details` | `/api/v1/monitor/youtube/video-details` | Individual video details |
| `/api/youtube/metrics` | `/api/v1/monitor/youtube/metrics` | Video metrics |
| `/api/youtube/analytics/videos` | `/api/v1/monitor/youtube/analytics/videos` | Video analytics |
| `/api/youtube/comments` | `/api/v1/monitor/youtube/comments` | Video comments |
| `/api/youtube/analytics/comments` | `/api/v1/monitor/youtube/analytics/comments` | Comment analytics |
| `/api/youtube/engagement` | `/api/v1/monitor/youtube/engagement` | Engagement metrics |

## 🛠️ **Setup Instructions**

### 1. **Backend Setup** (Python FastAPI)

```bash
cd Influencerflow_backend

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
echo "YOUTUBE_API_KEY=your_youtube_api_key_here" >> .env

# Start the backend server
python main.py
```

### 2. **Frontend Setup** (Next.js)

```bash
cd influencerflow_frontend

# Install dependencies
npm install

# Set up environment variables
echo "BACKEND_URL=http://localhost:8000" >> .env.local

# Start the development server
npm run dev
```

### 3. **YouTube API Key Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **YouTube Data API v3**
4. Create credentials (API Key)
5. Add the API key to your backend `.env` file:
   ```
   YOUTUBE_API_KEY=AIzaSy...your_api_key
   ```

## 🎯 **How to Use**

### Channel Analytics
1. Navigate to `/dashboard/content-analysis`
2. Enter a **channel name** (e.g., "mkbhd", "@mkbhd", "Marques Brownlee")
3. Click "Analyze Channel" to view comprehensive channel analytics

### Video Analytics  
1. Enter a **YouTube video URL** (e.g., `https://youtube.com/watch?v=...`)
2. The system will automatically extract video details and show performance metrics

### Comment Analytics
1. Video comments are automatically loaded when analyzing videos
2. Includes basic sentiment analysis and engagement metrics

### Engagement Metrics
1. Select time periods (7d, 30d, 90d, 365d)
2. View engagement trends and performance recommendations

## 📊 **Features**

### Real Data Integration
- ✅ **Channel Statistics**: Real subscriber counts, view counts, video counts
- ✅ **Video Metrics**: Actual video performance data, engagement rates
- ✅ **Comment Analysis**: Real YouTube comments with sentiment analysis
- ✅ **Growth Analytics**: Historical data and trend analysis
- ✅ **Engagement Tracking**: Real engagement rates and performance metrics

### UI Components
- 📱 **Responsive Design**: Works on all device sizes
- 🎨 **Modern UI**: Built with shadcn/ui components
- 📈 **Interactive Charts**: Recharts integration for data visualization
- ⚡ **Loading States**: Skeleton components during data loading
- 🚨 **Error Handling**: User-friendly error messages and retry options

## 🔧 **Technical Details**

### Environment Variables

#### Frontend (`.env.local`)
```bash
BACKEND_URL=http://localhost:8000
```

#### Backend (`.env`)
```bash
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### Tech Stack
- **Frontend**: Next.js 14, React 19, TypeScript, shadcn/ui, Recharts
- **Backend**: Python FastAPI, Google YouTube Data API v3
- **Architecture**: Server-side API proxy pattern
- **Styling**: Tailwind CSS with shadcn/ui components

## 🐛 **Troubleshooting**

### Common Issues

1. **"Backend server is not running"**
   - Ensure Python backend is running on port 8000
   - Check that `BACKEND_URL` is correctly set in `.env.local`

2. **"YouTube API key not configured"**
   - Add `YOUTUBE_API_KEY` to backend `.env` file
   - Restart the Python backend server

3. **"Channel not found"**
   - Try different channel name formats (@username, display name)
   - Ensure the channel exists and is public

4. **API Rate Limits**
   - YouTube API has quotas (10,000 requests/day by default)
   - Monitor usage in Google Cloud Console

### Debug Steps

1. **Check Backend Health**:
   ```bash
   curl http://localhost:8000/health
   ```

2. **Test Next.js API Route**:
   ```bash
   curl http://localhost:3000/api/youtube/channel-id?channel_name=mkbhd
   ```

3. **Verify Environment Variables**:
   ```bash
   # In backend directory
   python -c "import os; print(os.getenv('YOUTUBE_API_KEY'))"
   ```

## 📝 **Future Enhancements**

- [ ] Real-time notifications for new videos
- [ ] Competitor analysis features
- [ ] Export data to CSV/PDF
- [ ] Advanced analytics filters
- [ ] Custom dashboard layouts
- [ ] Integration with other social platforms
- [ ] Automated reporting features
- [ ] Performance optimization recommendations
- [ ] Dashboard customization options 

## 🎉 **Success!**

Your YouTube Analytics Dashboard is now fully integrated with real API data through a clean Next.js proxy architecture. The system automatically handles channel name resolution, provides comprehensive analytics, and offers a modern, responsive interface for content analysis. 