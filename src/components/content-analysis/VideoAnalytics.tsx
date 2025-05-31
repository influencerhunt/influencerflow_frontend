"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { 
  Eye, 
  ThumbsUp, 
  ThumbsDown,
  MessageCircle,
  Share2,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Play,
  Hash,
  ExternalLink,
  BarChart3,
  Copy,
  RefreshCw,
  AlertCircle,
  Video
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { youtubeApi, handleApiError } from "@/lib/api";

interface VideoAnalyticsProps {
  channelId: string; // This now accepts both channel names and IDs
  videoUrl: string;
}

const VideoAnalytics = ({ channelId, videoUrl }: VideoAnalyticsProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoDetails, setVideoDetails] = useState<any>(null);
  const [videoMetrics, setVideoMetrics] = useState<any[]>([]);
  const [videoAnalytics, setVideoAnalytics] = useState<any>(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>(videoUrl || "");

  // Mock performance timeline data - this would ideally come from time-series analytics
  const performanceTimeline = [
    { hour: "0h", views: 1200, likes: 45, comments: 8 },
    { hour: "1h", views: 2800, likes: 120, comments: 22 },
    { hour: "2h", views: 4500, likes: 200, comments: 35 },
    { hour: "6h", views: 12000, likes: 650, comments: 85 },
    { hour: "12h", views: 25000, likes: 1400, comments: 180 },
    { hour: "24h", views: 45000, likes: 2800, comments: 320 },
    { hour: "48h", views: 78000, likes: 5200, comments: 480 },
    { hour: "7d", views: 180000, likes: 12800, comments: 890 },
    { hour: "30d", views: 250000, likes: 18500, comments: 1250 }
  ];

  const engagementBreakdown = [
    { metric: "Views", value: 250000, percentage: 100, change: "+12%" },
    { metric: "Likes", value: 18500, percentage: 7.4, change: "+8%" },
    { metric: "Comments", value: 1250, percentage: 0.5, change: "+15%" },
    { metric: "Shares", value: 890, percentage: 0.36, change: "+5%" },
    { metric: "Subscribers", value: 420, percentage: 0.17, change: "+22%" }
  ];

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : "";
  };

  const fetchVideoData = async () => {
    if (!selectedVideoUrl && (!channelId || channelId.trim() === '')) return;
    
    setLoading(true);
    setError(null);

    try {
      const promises = [];
      
      // Fetch video details if URL is provided
      if (selectedVideoUrl && selectedVideoUrl.trim() !== '') {
        promises.push(youtubeApi.getVideoDetails(selectedVideoUrl));
      } else {
        promises.push(Promise.resolve(null));
      }

      // Fetch video metrics for channel
      if (channelId && channelId.trim() !== '') {
        promises.push(youtubeApi.getVideoMetrics(channelId));
        promises.push(youtubeApi.getVideoAnalytics(channelId));
      } else {
        promises.push(Promise.resolve({ videos: [] }));
        promises.push(Promise.resolve(null));
      }

      const [videoDetailsResponse, videoMetricsResponse, videoAnalyticsResponse] = await Promise.all(promises);

      if (videoDetailsResponse) {
        setVideoDetails(videoDetailsResponse);
      }
      
      setVideoMetrics(videoMetricsResponse?.videos || []);
      setVideoAnalytics(videoAnalyticsResponse);
      
    } catch (error: any) {
      const errorInfo = handleApiError(error);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: string | number) => {
    const n = typeof num === "string" ? parseInt(num) : num;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  const formatDuration = (duration: string) => {
    const match = duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "0:00";
    
    const hours = parseInt(match[1] || "0");
    const minutes = parseInt(match[2] || "0");
    const seconds = parseInt(match[3] || "0");
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const calculateEngagementRate = (likes: string | number, comments: string | number, views: string | number) => {
    const l = typeof likes === "string" ? parseInt(likes) : likes;
    const c = typeof comments === "string" ? parseInt(comments) : comments;
    const v = typeof views === "string" ? parseInt(views) : views;
    if (v === 0) return "0.0";
    return ((l + c) / v * 100).toFixed(1);
  };

  useEffect(() => {
    fetchVideoData();
  }, [selectedVideoUrl, channelId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchVideoData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Video Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="w-5 h-5 mr-2" />
            Video Analysis
          </CardTitle>
          <CardDescription>
            Analyze individual video performance and metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="video-url-input">Video URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="video-url-input"
                  placeholder="https://youtube.com/watch?v=..."
                  value={selectedVideoUrl}
                  onChange={(e) => setSelectedVideoUrl(e.target.value)}
                />
                <Button onClick={fetchVideoData}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analyze
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {videoDetails && (
        <>
          {/* Video Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(videoDetails.metrics?.views || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  Total views
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Likes</CardTitle>
                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(videoDetails.metrics?.likes || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  {calculateEngagementRate(videoDetails.metrics?.likes || 0, "0", videoDetails.metrics?.views || 1)}% of views
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comments</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(videoDetails.metrics?.comments || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  {calculateEngagementRate("0", videoDetails.metrics?.comments || 0, videoDetails.metrics?.views || 1)}% of views
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold">
                  {videoDetails.published_at ? new Date(videoDetails.published_at).toLocaleDateString() : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Upload date
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculateEngagementRate(videoDetails.metrics?.likes || 0, videoDetails.metrics?.comments || 0, videoDetails.metrics?.views || 1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Engagement rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Video Performance Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Timeline</CardTitle>
              <CardDescription>Video engagement over time since publication (simulated data)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  views: {
                    label: "Views",
                    color: "hsl(var(--chart-1))",
                  },
                  likes: {
                    label: "Likes",
                    color: "hsl(var(--chart-2))",
                  },
                  comments: {
                    label: "Comments",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceTimeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="views" stackId="1" stroke="var(--color-views)" fill="var(--color-views)" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="likes" stackId="2" stroke="var(--color-likes)" fill="var(--color-likes)" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="comments" stackId="3" stroke="var(--color-comments)" fill="var(--color-comments)" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Video Details & Engagement Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Information */}
            <Card>
              <CardHeader>
                <CardTitle>Video Details</CardTitle>
                <CardDescription>Metadata and content information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <Play className="w-12 h-12 text-muted-foreground" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">{videoDetails.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {videoDetails.published_at ? new Date(videoDetails.published_at).toLocaleDateString() : "N/A"}
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {formatNumber(videoDetails.metrics?.views || 0)} views
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={videoDetails.description || "No description available"}
                    readOnly
                    className="h-32 resize-none"
                  />
                </div>

                {videoDetails.hashtags && videoDetails.hashtags.length > 0 && (
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Hash className="w-4 h-4 mr-1" />
                      Hashtags
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {videoDetails.hashtags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button variant="outline" className="w-full" onClick={() => window.open(`https://youtube.com/watch?v=${videoDetails.video_id}`, '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on YouTube
                </Button>
              </CardContent>
            </Card>

            {/* Engagement Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Breakdown</CardTitle>
                <CardDescription>Detailed performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {engagementBreakdown.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {formatNumber(item.value)}
                        </span>
                        <Badge variant={item.change.startsWith('+') ? 'default' : 'secondary'} className="text-xs">
                          {item.change}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={item.percentage} className="flex-1" />
                      <span className="text-xs text-muted-foreground w-12">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Performance Summary</h4>
                  <p className="text-xs text-muted-foreground">
                    This video has an engagement rate of {calculateEngagementRate(videoDetails.metrics?.likes || 0, videoDetails.metrics?.comments || 0, videoDetails.metrics?.views || 1)}%. 
                    The metrics show good audience interaction with the content.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Channel Video Metrics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Channel Video Metrics</CardTitle>
            <CardDescription>Performance comparison across recent videos</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchVideoData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {videoMetrics.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Video</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Engagement Rate</TableHead>
                  <TableHead>Published</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videoMetrics.map((video, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-10 bg-muted rounded flex items-center justify-center">
                          <Play className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm line-clamp-2">{video.title}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1 text-muted-foreground" />
                        {formatNumber(video.view_count || 0)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ThumbsUp className="w-4 h-4 mr-1 text-muted-foreground" />
                        {formatNumber(video.like_count || 0)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1 text-muted-foreground" />
                        {formatNumber(video.comment_count || 0)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                        <span className="text-sm">{formatDuration(video.duration)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {calculateEngagementRate(video.like_count || 0, video.comment_count || 0, video.view_count || 1)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {video.published_at ? new Date(video.published_at).toLocaleDateString() : "N/A"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No video metrics available. Enter a channel ID to see recent videos.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoAnalytics; 