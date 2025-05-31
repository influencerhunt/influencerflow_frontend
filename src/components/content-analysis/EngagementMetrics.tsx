"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { 
  TrendingUp, 
  TrendingDown,
  ThumbsUp, 
  MessageCircle,
  Share2,
  Eye,
  Users,
  Calendar,
  Target,
  Award,
  Activity,
  BarChart3,
  RefreshCw,
  Info,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertCircle,
  Video
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { youtubeApi, handleApiError } from "@/lib/api";

interface EngagementMetricsProps {
  channelId: string; // This now accepts both channel names and IDs
}

const EngagementMetrics = ({ channelId }: EngagementMetricsProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [engagementData, setEngagementData] = useState<any>(null);
  const [periodDays, setPeriodDays] = useState("30");

  // Mock comparison data - would come from competitive analysis service
  const competitorComparison = [
    { category: "Engagement Rate", yourChannel: 7.8, industry: 6.2, competitor: 7.1 },
    { category: "Comment Rate", yourChannel: 1.8, industry: 1.2, competitor: 1.5 },
    { category: "Share Rate", yourChannel: 0.8, industry: 0.5, competitor: 0.7 },
    { category: "Subscriber Rate", yourChannel: 0.2, industry: 0.15, competitor: 0.18 },
    { category: "Retention Rate", yourChannel: 68, industry: 45, competitor: 52 }
  ];

  const fetchEngagementData = async () => {
    if (!channelId || channelId.trim() === '') {
      setEngagementData(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const durationMap: { [key: string]: string } = {
        "7": "7d",
        "30": "30d", 
        "90": "90d",
        "365": "365d"
      };

      const response = await youtubeApi.getEngagementMetrics(channelId, durationMap[periodDays] || "30d");
      setEngagementData(response);
    } catch (error: any) {
      const errorInfo = handleApiError(error);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceBadge = (performance: string) => {
    const variants = {
      excellent: "default",
      good: "secondary",
      average: "outline",
      poor: "destructive"
    } as const;
    
    return (
      <Badge variant={variants[performance as keyof typeof variants] || "outline"} className="text-xs">
        {performance}
      </Badge>
    );
  };

  const getTrendIcon = (trend: string) => {
    if (trend.startsWith('+')) {
      return <ArrowUp className="w-3 h-3 text-green-500" />;
    } else if (trend.startsWith('-')) {
      return <ArrowDown className="w-3 h-3 text-red-500" />;
    } else {
      return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const calculateEngagementBreakdown = () => {
    if (!engagementData?.videos) return [];
    
    const videos = engagementData.videos;
    const totalEngagements = videos.reduce((sum: number, video: any) => 
      sum + parseInt(video.likes || 0) + parseInt(video.comments || 0), 0
    );
    
    const totalLikes = videos.reduce((sum: number, video: any) => sum + parseInt(video.likes || 0), 0);
    const totalComments = videos.reduce((sum: number, video: any) => sum + parseInt(video.comments || 0), 0);
    
    return [
      { 
        metric: "Likes", 
        percentage: (totalLikes / totalEngagements * 100) || 0, 
        avgRate: ((totalLikes / videos.length) || 0).toFixed(1), 
        change: "+8%" 
      },
      { 
        metric: "Comments", 
        percentage: (totalComments / totalEngagements * 100) || 0, 
        avgRate: ((totalComments / videos.length) || 0).toFixed(1), 
        change: "+15%" 
      },
      { 
        metric: "Shares", 
        percentage: 8, 
        avgRate: "0.8%", 
        change: "+5%" 
      },
      { 
        metric: "Subscribers", 
        percentage: 2, 
        avgRate: "0.2%", 
        change: "+22%" 
      }
    ];
  };

  useEffect(() => {
    fetchEngagementData();
  }, [channelId, periodDays]);

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
            <Button onClick={fetchEngagementData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!engagementData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Enter a channel ID to view engagement metrics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const engagementBreakdown = calculateEngagementBreakdown();

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Engagement Analytics
              </CardTitle>
              <CardDescription>
                Track audience engagement across your content over time
              </CardDescription>
            </div>
            <Select value={periodDays} onValueChange={setPeriodDays}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Engagement Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Engagement Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementData.average_engagement_rate || "0.0"}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUp className="w-3 h-3 text-green-500" />
              <span className="ml-1">+12% vs industry avg</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos Analyzed</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementData.video_count || 0}</div>
            <p className="text-xs text-muted-foreground">
              In the last {periodDays} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Performing</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold">
              {engagementData.videos && engagementData.videos.length > 0 ? 
                engagementData.videos.reduce((best: any, current: any) => 
                  (current.engagement_rate > best.engagement_rate) ? current : best
                ).title?.substring(0, 20) + "..." : "No data"
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {engagementData.videos && engagementData.videos.length > 0 ? 
                `${engagementData.videos.reduce((best: any, current: any) => 
                  (current.engagement_rate > best.engagement_rate) ? current : best
                ).engagement_rate}% engagement` : "N/A"
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industry Rank</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Top 15%</div>
            <p className="text-xs text-muted-foreground">
              Above average performer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Timeline */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Engagement Rate by Video</CardTitle>
            <CardDescription>Individual video performance in the selected period</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchEngagementData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {engagementData.videos && engagementData.videos.length > 0 ? (
            <ChartContainer
              config={{
                engagement_rate: {
                  label: "Engagement Rate",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData.videos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="title" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="engagement_rate" 
                    fill="var(--color-engagement_rate)" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No engagement data available for this period</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Engagement Breakdown & Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Breakdown</CardTitle>
            <CardDescription>Distribution of engagement types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {engagementBreakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.metric}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{item.avgRate}</span>
                    <Badge variant="outline" className="text-xs">
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
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Engagement Insights</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your engagement rate is above industry average. The data shows good audience interaction 
                    across your recent content with strong comment engagement.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitive Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Competitive Analysis</CardTitle>
            <CardDescription>How you compare to industry benchmarks</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                yourChannel: { label: "Your Channel", color: "hsl(var(--chart-1))" },
                industry: { label: "Industry Avg", color: "hsl(var(--chart-2))" },
                competitor: { label: "Top Competitor", color: "hsl(var(--chart-3))" },
              }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={competitorComparison}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis tick={{ fontSize: 8 }} />
                  <Radar
                    name="Your Channel"
                    dataKey="yourChannel"
                    stroke="var(--color-yourChannel)"
                    fill="var(--color-yourChannel)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Industry Avg"
                    dataKey="industry"
                    stroke="var(--color-industry)"
                    fill="var(--color-industry)"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Top Competitor"
                    dataKey="competitor"
                    stroke="var(--color-competitor)"
                    fill="var(--color-competitor)"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Video Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Video Performance Analysis</CardTitle>
          <CardDescription>Engagement metrics for individual videos</CardDescription>
        </CardHeader>
        <CardContent>
          {engagementData.videos && engagementData.videos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Video</TableHead>
                  <TableHead>Engagement Rate</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Published</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {engagementData.videos.map((video: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                          <Eye className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm line-clamp-1">{video.title}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{video.engagement_rate}%</span>
                        {video.engagement_rate > 8 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : video.engagement_rate > 6 ? (
                          <TrendingUp className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatNumber(parseInt(video.views || 0))}</TableCell>
                    <TableCell>{formatNumber(parseInt(video.likes || 0))}</TableCell>
                    <TableCell>{formatNumber(parseInt(video.comments || 0))}</TableCell>
                    <TableCell>
                      {getPerformanceBadge(
                        video.engagement_rate > 8 ? "excellent" : 
                        video.engagement_rate > 6 ? "good" : 
                        video.engagement_rate > 4 ? "average" : "poor"
                      )}
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
              <p className="text-muted-foreground">No video performance data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Engagement Optimization Recommendations
          </CardTitle>
          <CardDescription>AI-powered suggestions to improve your engagement metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <h4 className="font-semibold text-sm">Boost Comment Engagement</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Consider asking more questions in your videos and responding to comments within 
                the first 2 hours of publishing to boost engagement.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Share2 className="w-4 h-4 text-green-500" />
                <h4 className="font-semibold text-sm">Increase Share Rate</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Create more shareable moments by including tips, tutorials, or surprising facts. 
                Consider adding clear call-to-actions for sharing.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <h4 className="font-semibold text-sm">Optimal Posting Times</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Analyze your highest engagement times and consider scheduling more content 
                during those peak periods for maximum reach.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-orange-500" />
                <h4 className="font-semibold text-sm">Audience Retention</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Keep intros under 15 seconds and deliver value early in your videos to 
                maintain high engagement throughout.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementMetrics; 