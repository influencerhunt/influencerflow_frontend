"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  ThumbsUp, 
  MessageCircle,
  Video,
  Calendar,
  Search,
  ExternalLink,
  Copy,
  Download
} from "lucide-react";

import ChannelAnalytics from "@/components/content-analysis/ChannelAnalytics";
import VideoAnalytics from "@/components/content-analysis/VideoAnalytics";
import CommentAnalytics from "@/components/content-analysis/CommentAnalytics";
import EngagementMetrics from "@/components/content-analysis/EngagementMetrics";

export default function ContentAnalysisPage() {
  const [activeTab, setActiveTab] = useState("channel");
  const [channelName, setChannelName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleAnalyze = () => {
    // This would trigger the API calls based on the active tab
    console.log("Analyzing:", { activeTab, channelName, videoUrl });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Analysis</h1>
            <p className="text-muted-foreground">
              Analyze YouTube channels and videos for comprehensive insights
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="px-3 py-1">
              <BarChart3 className="w-4 h-4 mr-1" />
              Analytics Dashboard
            </Badge>
          </div>
        </div>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Quick Analysis
            </CardTitle>
            <CardDescription>
              Enter a channel name/username or video URL to get started with analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="channel-name">Channel Name</Label>
                <Input
                  id="channel-name"
                  placeholder="e.g., mkbhd, veritasium, @channelname"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the channel username, handle (@channelname), or display name
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-url">Video URL</Label>
                <Input
                  id="video-url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Full YouTube video URL for detailed video analysis
                </p>
              </div>
            </div>
            <Button onClick={handleAnalyze} className="w-full md:w-auto">
              <TrendingUp className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
            
            {/* Sample channels for testing */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Try these sample channels:</h4>
              <div className="flex flex-wrap gap-2">
                {["mkbhd", "veritasium", "3blue1brown", "kurzgesagt"].map((sample) => (
                  <Button
                    key={sample}
                    variant="outline"
                    size="sm"
                    onClick={() => setChannelName(sample)}
                    className="text-xs"
                  >
                    {sample}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="channel" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Channel
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center">
            <Video className="w-4 h-4 mr-2" />
            Video
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" />
            Comments
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center">
            <ThumbsUp className="w-4 h-4 mr-2" />
            Engagement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="channel" className="space-y-6">
          <ChannelAnalytics channelId={channelName} />
        </TabsContent>

        <TabsContent value="video" className="space-y-6">
          <VideoAnalytics channelId={channelName} videoUrl={videoUrl} />
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <CommentAnalytics />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <EngagementMetrics channelId={channelName} />
        </TabsContent>
      </Tabs>

      {/* API Endpoints Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ExternalLink className="w-5 h-5 mr-2" />
            API Reference
          </CardTitle>
          <CardDescription>
            Available endpoints for YouTube analytics - now supports channel names!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Channel Analytics</h4>
              <div className="text-xs space-y-1 text-muted-foreground">
                <div>/api/v1/monitor/youtube/stats</div>
                <div>/api/v1/monitor/youtube/channel-id</div>
                <div>/api/v1/monitor/youtube/videos</div>
                <div>/api/v1/monitor/youtube/stats-by-name</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Video Analytics</h4>
              <div className="text-xs space-y-1 text-muted-foreground">
                <div>/api/v1/monitor/youtube/video-details</div>
                <div>/api/v1/monitor/youtube/metrics</div>
                <div>/api/v1/monitor/youtube/engagement</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Comment Analytics</h4>
              <div className="text-xs space-y-1 text-muted-foreground">
                <div>/api/v1/monitor/youtube/comments</div>
                <div>/api/v1/monitor/youtube/analytics/comments</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border">
            <p className="text-sm text-blue-800">
              <strong>📝 Note:</strong> You can now use channel names (like "mkbhd" or "@channelname") 
              instead of complex channel IDs. The system will automatically convert them to the required format.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 