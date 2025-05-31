"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { 
  MessageCircle, 
  ThumbsUp, 
  User,
  Calendar,
  Heart,
  TrendingUp,
  TrendingDown,
  Smile,
  Frown,
  Meh,
  Search,
  Filter,
  RefreshCw,
  MoreHorizontal,
  Reply,
  Flag,
  AlertCircle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { youtubeApi, handleApiError } from "@/lib/api";

interface CommentAnalyticsProps {
  videoId?: string;
}

const CommentAnalytics = ({ videoId }: CommentAnalyticsProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentAnalytics, setCommentAnalytics] = useState<any>(null);
  const [searchVideoId, setSearchVideoId] = useState(videoId || "");
  const [maxResults, setMaxResults] = useState("10");
  const [sortBy, setSortBy] = useState("relevance");

  // Mock sentiment data - this would come from a sentiment analysis service
  const sentimentData = [
    { name: "Positive", value: 65, count: 812, color: "#22c55e" },
    { name: "Neutral", value: 25, count: 312, color: "#64748b" },
    { name: "Negative", value: 10, count: 126, color: "#ef4444" }
  ];

  const engagementData = [
    { hour: "0-2h", comments: 45, avgLikes: 12, replies: 8 },
    { hour: "2-6h", comments: 128, avgLikes: 18, replies: 25 },
    { hour: "6-12h", comments: 234, avgLikes: 22, replies: 45 },
    { hour: "12-24h", comments: 189, avgLikes: 28, replies: 38 },
    { hour: "1-7d", comments: 456, avgLikes: 15, replies: 89 },
    { hour: "7d+", comments: 198, avgLikes: 8, replies: 32 }
  ];

  const topCommentors = [
    { name: "TechReviewer_Pro", comments: 12, totalLikes: 245, avgSentiment: "positive" },
    { name: "CodeWiz_2024", comments: 8, totalLikes: 189, avgSentiment: "positive" },
    { name: "ReactMaster", comments: 6, totalLikes: 156, avgSentiment: "neutral" },
    { name: "WebDev_Guru", comments: 5, totalLikes: 134, avgSentiment: "positive" },
    { name: "JSExpert", comments: 4, totalLikes: 98, avgSentiment: "neutral" }
  ];

  const fetchComments = async () => {
    if (!searchVideoId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch comments and analytics in parallel
      const [commentsResponse, analyticsResponse] = await Promise.all([
        youtubeApi.getVideoComments(searchVideoId, parseInt(maxResults)),
        youtubeApi.getCommentAnalytics(searchVideoId).catch(() => null) // Analytics might not be available
      ]);

      setComments(commentsResponse.comments || []);
      setCommentAnalytics(analyticsResponse);
    } catch (error: any) {
      const errorInfo = handleApiError(error);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Smile className="w-4 h-4 text-green-500" />;
      case "negative":
        return <Frown className="w-4 h-4 text-red-500" />;
      default:
        return <Meh className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    const variants = {
      positive: "default",
      negative: "destructive",
      neutral: "secondary"
    } as const;
    
    return (
      <Badge variant={variants[sentiment as keyof typeof variants] || "secondary"} className="text-xs">
        {sentiment}
      </Badge>
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return "< 1h ago";
    }
  };

  // Add simple sentiment analysis (this is a basic example)
  const analyzeSentiment = (text: string) => {
    const positiveWords = ['good', 'great', 'awesome', 'excellent', 'amazing', 'love', 'perfect', 'best', 'wonderful', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'sucks', 'boring', 'useless', 'disappointing'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  useEffect(() => {
    if (searchVideoId) {
      fetchComments();
    }
  }, [searchVideoId, maxResults, sortBy]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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
            <Button onClick={fetchComments} variant="outline">
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
      {/* Comment Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Comment Analysis
          </CardTitle>
          <CardDescription>
            Analyze video comments for sentiment and engagement insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="video-id">Video ID</Label>
              <Input
                id="video-id"
                placeholder="dQw4w9WgXcQ"
                value={searchVideoId}
                onChange={(e) => setSearchVideoId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-results">Max Results</Label>
              <Select value={maxResults} onValueChange={setMaxResults}>
                <SelectTrigger>
                  <SelectValue placeholder="Select count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 comments</SelectItem>
                  <SelectItem value="25">25 comments</SelectItem>
                  <SelectItem value="50">50 comments</SelectItem>
                  <SelectItem value="100">100 comments</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort-by">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="time">Time</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={fetchComments} className="w-full md:w-auto">
            <Search className="w-4 h-4 mr-2" />
            Analyze Comments
          </Button>
        </CardContent>
      </Card>

      {comments.length > 0 && (
        <>
          {/* Comment Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{comments.length}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  Analyzed from video
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Likes/Comment</CardTitle>
                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {commentAnalytics?.average_likes_per_comment?.toFixed(1) || 
                   (comments.reduce((sum, comment) => sum + (comment.likes || 0), 0) / comments.length).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  Engagement metric
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Comment</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {commentAnalytics?.top_comment?.likes || Math.max(...comments.map(c => c.likes || 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  Most liked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
                <Smile className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(() => {
                    const sentiments = comments.map(c => analyzeSentiment(c.text || ''));
                    const positiveCount = sentiments.filter(s => s === 'positive').length;
                    return ((positiveCount / sentiments.length) * 10).toFixed(1);
                  })()}/10
                </div>
                <p className="text-xs text-muted-foreground">
                  <Smile className="h-3 w-3 inline mr-1" />
                  Overall sentiment
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sentiment Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
                <CardDescription>Comment sentiment breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    positive: { label: "Positive", color: "#22c55e" },
                    neutral: { label: "Neutral", color: "#64748b" },
                    negative: { label: "Negative", color: "#ef4444" },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={(() => {
                          const sentiments = comments.map(c => analyzeSentiment(c.text || ''));
                          const counts = {
                            positive: sentiments.filter(s => s === 'positive').length,
                            neutral: sentiments.filter(s => s === 'neutral').length,
                            negative: sentiments.filter(s => s === 'negative').length
                          };
                          return [
                            { name: "Positive", value: counts.positive, count: counts.positive, color: "#22c55e" },
                            { name: "Neutral", value: counts.neutral, count: counts.neutral, color: "#64748b" },
                            { name: "Negative", value: counts.negative, count: counts.negative, color: "#ef4444" }
                          ];
                        })()}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 space-y-2">
                  {(() => {
                    const sentiments = comments.map(c => analyzeSentiment(c.text || ''));
                    const counts = {
                      positive: sentiments.filter(s => s === 'positive').length,
                      neutral: sentiments.filter(s => s === 'neutral').length,
                      negative: sentiments.filter(s => s === 'negative').length
                    };
                    return [
                      { name: "Positive", count: counts.positive, color: "#22c55e" },
                      { name: "Neutral", count: counts.neutral, color: "#64748b" },
                      { name: "Negative", count: counts.negative, color: "#ef4444" }
                    ];
                  })().map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-muted-foreground">{item.count} comments</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Engagement Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Comment Engagement Over Time</CardTitle>
                <CardDescription>Comment activity and interaction patterns (simulated)</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    comments: {
                      label: "Comments",
                      color: "hsl(var(--chart-1))",
                    },
                    replies: {
                      label: "Replies",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="comments" fill="var(--color-comments)" />
                      <Bar dataKey="replies" fill="var(--color-replies)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Commentors */}
          <Card>
            <CardHeader>
              <CardTitle>Top Commentors</CardTitle>
              <CardDescription>Most active community members (simulated data)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Total Likes</TableHead>
                    <TableHead>Avg. Sentiment</TableHead>
                    <TableHead>Engagement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCommentors.map((commentor, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-sm">{commentor.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{commentor.comments}</TableCell>
                      <TableCell>{commentor.totalLikes}</TableCell>
                      <TableCell>
                        {getSentimentBadge(commentor.avgSentiment)}
                      </TableCell>
                      <TableCell>
                        <Progress value={(commentor.totalLikes / commentor.comments) * 2} className="w-16" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Individual Comments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Comments</CardTitle>
                <CardDescription>Latest comments with sentiment analysis</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={fetchComments}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {comments.map((comment, index) => {
                const sentiment = analyzeSentiment(comment.text || '');
                return (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{comment.author}</p>
                          <p className="text-xs text-muted-foreground">{formatTimeAgo(comment.published_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getSentimentIcon(sentiment)}
                        {getSentimentBadge(sentiment)}
                      </div>
                    </div>
                    
                    <p className="text-sm leading-relaxed">{comment.text}</p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{comment.likes || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Reply className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View replies</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Flag className="w-3 h-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Flag comment</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CommentAnalytics; 