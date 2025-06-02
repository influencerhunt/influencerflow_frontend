// "use client"

// import { useState, useEffect } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { useAuth } from '@/contexts/AuthContext'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { CardSpotlight } from '@/components/ui/card-spotlight'
// import { Separator } from '@/components/ui/separator'
// import { FilterEditor } from '@/components/FilterEditor'
// import { 
//   Search, 
//   Filter, 
//   MapPin, 
//   Users, 
//   TrendingUp, 
//   Star,
//   Edit,
//   Loader2,
//   AlertCircle,
//   RefreshCw,
//   ExternalLink,
//   Instagram,
//   Youtube,
//   Twitter,
//   CheckCircle,
//   Globe
// } from 'lucide-react'
// import Link from 'next/link'

// interface InfluencerProfile {
//   id: string
//   name: string
//   username: string
//   platform: string
//   followers: number
//   engagement_rate: number
//   price_per_post?: number
//   location: string
//   niche: string
//   bio: string
//   profile_link?: string
//   avatar_url?: string
//   verified: boolean
//   source: 'on_platform' | 'external'
//   created_at?: string
//   updated_at?: string
// }

// interface SearchFilters {
//   platform?: string
//   followers_min?: number
//   followers_max?: number
//   price_min?: number
//   price_max?: number
//   location?: string
//   niche?: string
//   engagement_min?: number
//   engagement_max?: number
//   verified_only?: boolean
// }

// interface SearchResponse {
//   query: string
//   total_results: number
//   on_platform_count: number
//   external_count: number
//   influencers: InfluencerProfile[]
//   filters?: SearchFilters
// }

// export default function SearchPage() {
//   const [query, setQuery] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [searchResults, setSearchResults] = useState<InfluencerProfile[]>([])
//   const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null)
//   const [extractedFilters, setExtractedFilters] = useState<SearchFilters | null>(null)
//   const [showFilters, setShowFilters] = useState(false)
//   const [hasSearched, setHasSearched] = useState(false)
//   const [showFilterEditor, setShowFilterEditor] = useState(false)
  
//   const { user, loading } = useAuth()
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login')
//     }
//   }, [user, loading, router])

//   // Get initial query from URL params if available
//   useEffect(() => {
//     const q = searchParams?.get('q')
//     if (q) {
//       setQuery(q)
//       handleSearch(q)
//     }
//   }, [searchParams])

//   const handleSearch = async (searchQuery: string = query) => {
//     await handleSearchWithFilters(searchQuery)
//   }

//   const handleEditFilters = () => {
//     setShowFilterEditor(true)
//   }

//   const handleFiltersChange = (newFilters: SearchFilters) => {
//     setExtractedFilters(newFilters)
//     // Trigger new search with updated filters
//     handleSearchWithFilters(query, newFilters)
//   }

//   const handleSearchWithFilters = async (searchQuery: string, filters?: SearchFilters) => {
//     if (!searchQuery.trim()) return

//     setIsLoading(true)
//     setError('')
//     setHasSearched(true)

//     try {
//       const response = await fetch('/api/search/influencers', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           query: searchQuery,
//           filters: filters || extractedFilters,
//           limit: 20,
//           include_external: true
//         }),
//       })

//       if (!response.ok) {
//         throw new Error('Search failed')
//       }

//       const data: SearchResponse = await response.json()
//       setSearchResponse(data)
//       setSearchResults(data.influencers || [])
//       if (!filters && data.filters) {
//         setExtractedFilters(data.filters)
//       }
//     } catch (error: any) {
//       setError(error.message || 'Search failed. Please try again.')
//       // Mock data for demonstration
//       const mockResponse: SearchResponse = {
//         query: searchQuery,
//         total_results: mockInfluencers.length,
//         on_platform_count: mockInfluencers.filter(i => i.source === 'on_platform').length,
//         external_count: mockInfluencers.filter(i => i.source === 'external').length,
//         influencers: mockInfluencers
//       }
//       setSearchResponse(mockResponse)
//       setSearchResults(mockInfluencers)
//       if (!filters) {
//         setExtractedFilters(mockFilters)
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const formatNumber = (num: number) => {
//     if (num >= 1000000) {
//       return (num / 1000000).toFixed(1) + 'M'
//     }
//     if (num >= 1000) {
//       return (num / 1000).toFixed(1) + 'K'
//     }
//     return num.toString()
//   }

//   const getPlatformIcon = (platform: string) => {
//     switch (platform.toLowerCase()) {
//       case 'instagram':
//         return <Instagram className="w-4 h-4" />
//       case 'youtube':
//         return <Youtube className="w-4 h-4" />
//       case 'twitter':
//         return <Twitter className="w-4 h-4" />
//       default:
//         return <Globe className="w-4 h-4" />
//     }
//   }

//   const getSourceBadge = (source: 'on_platform' | 'external') => {
//     if (source === 'on_platform') {
//       return (
//         <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
//           <CheckCircle className="w-3 h-3 mr-1" />
//           On Platform
//         </Badge>
//       )
//     } else {
//       return (
//         <Badge variant="outline" className="border-blue-200 text-blue-800">
//           <ExternalLink className="w-3 h-3 mr-1" />
//           External
//         </Badge>
//       )
//     }
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8 max-w-6xl">
//         <div className="flex items-center justify-center min-h-[400px]">
//           <div className="text-center">
//             <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
//             <p className="text-muted-foreground">Loading...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (!user) return null

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-6xl">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-2">🔍 AI-Powered Influencer Search</h1>
//         <p className="text-muted-foreground">
//           Describe what you're looking for in natural language and we'll find the perfect influencers for your campaign
//         </p>
//       </div>

//       {/* Search Bar */}
//       <Card className="mb-8">
//         <CardContent className="pt-6">
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <Input
//                 placeholder="e.g., 'Tech reviewers with 100K+ followers who create iPhone content'"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//                 className="text-base"
//               />
//             </div>
//             <Button onClick={() => handleSearch()} disabled={isLoading || !query.trim()}>
//               {isLoading ? (
//                 <Loader2 className="w-4 h-4 animate-spin mr-2" />
//               ) : (
//                 <Search className="w-4 h-4 mr-2" />
//               )}
//               Search
//             </Button>
//           </div>
          
//           {/* Quick Search Examples */}
//           <div className="mt-4">
//             <p className="text-sm text-muted-foreground mb-2">Try these examples:</p>
//             <div className="flex flex-wrap gap-2">
//               {[
//                 "Fashion influencers in NYC",
//                 "Gaming creators with high engagement",
//                 "Food bloggers under $1000 budget",
//                 "Tech reviewers for smartphone launches"
//               ].map((example) => (
//                 <Button
//                   key={example}
//                   variant="outline"
//                   size="sm"
//                   onClick={() => {
//                     setQuery(example)
//                     handleSearch(example)
//                   }}
//                   className="text-xs"
//                 >
//                   {example}
//                 </Button>
//               ))}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Error Display */}
//       {error && (
//         <Card className="mb-8 border-destructive">
//           <CardContent className="pt-6">
//             <div className="flex items-center gap-2 text-destructive">
//               <AlertCircle className="w-4 h-4" />
//               <span>{error}</span>
//               <Button variant="outline" size="sm" onClick={() => handleSearch()}>
//                 <RefreshCw className="w-4 h-4 mr-2" />
//                 Retry
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Search Results Summary */}
//       {hasSearched && searchResponse && (
//         <Card className="mb-6">
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-semibold text-lg">Search Results</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Found {searchResponse.total_results} influencers: {searchResponse.on_platform_count} on-platform, {searchResponse.external_count} external
//                 </p>
//               </div>
//               <div className="flex gap-2">
//                 <Badge variant="default" className="bg-green-100 text-green-800">
//                   {searchResponse.on_platform_count} On Platform
//                 </Badge>
//                 <Badge variant="outline" className="border-blue-200 text-blue-800">
//                   {searchResponse.external_count} External
//                 </Badge>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Extracted Filters Display */}
//       {hasSearched && extractedFilters && (
//         <Card className="mb-8">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle className="flex items-center gap-2">
//                   <Filter className="w-5 h-5" />
//                   Extracted Filters
//                 </CardTitle>
//                 <CardDescription>
//                   We analyzed your search and extracted these filters
//                 </CardDescription>
//               </div>
//               <Button variant="outline" size="sm" onClick={handleEditFilters}>
//                 <Edit className="w-4 h-4 mr-2" />
//                 Edit Filters
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-wrap gap-2">
//               {extractedFilters.niche && (
//                 <Badge variant="secondary">
//                   {extractedFilters.niche}
//                 </Badge>
//               )}
//               {extractedFilters.location && (
//                 <Badge variant="outline">
//                   <MapPin className="w-3 h-3 mr-1" />
//                   {extractedFilters.location}
//                 </Badge>
//               )}
//               {extractedFilters.followers_min && (
//                 <Badge variant="outline">
//                   <Users className="w-3 h-3 mr-1" />
//                   {formatNumber(extractedFilters.followers_min)}+ followers
//                 </Badge>
//               )}
//               {extractedFilters.engagement_min && (
//                 <Badge variant="outline">
//                   <TrendingUp className="w-3 h-3 mr-1" />
//                   {extractedFilters.engagement_min}%+ engagement
//                 </Badge>
//               )}
//               {extractedFilters.platform && (
//                 <Badge variant="outline">
//                   {getPlatformIcon(extractedFilters.platform)}
//                   <span className="ml-1 capitalize">{extractedFilters.platform}</span>
//                 </Badge>
//               )}
//               {extractedFilters.price_max && (
//                 <Badge variant="outline">
//                   💰 Under ${extractedFilters.price_max}
//                 </Badge>
//               )}
//               {extractedFilters.verified_only && (
//                 <Badge variant="outline">
//                   <Star className="w-3 h-3 mr-1" />
//                   Verified Only
//                 </Badge>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Search Results */}
//       {hasSearched && (
//         <>
//           {searchResults.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {searchResults.map((influencer) => (
//                 <CardSpotlight key={influencer.id} className="h-full">
//                   <Card className="h-full">
//                     <CardContent className="p-6">
//                       {/* Header with Avatar and Source Badge */}
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex items-start gap-3">
//                           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
//                             {influencer.avatar_url ? (
//                               <img 
//                                 src={influencer.avatar_url} 
//                                 alt={influencer.name}
//                                 className="w-full h-full object-cover"
//                               />
//                             ) : (
//                               influencer.name.charAt(0).toUpperCase()
//                             )}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <h3 className="font-semibold text-lg truncate">{influencer.name}</h3>
//                             <p className="text-sm text-muted-foreground">@{influencer.username}</p>
//                             <div className="flex items-center gap-1 mt-1">
//                               {getPlatformIcon(influencer.platform)}
//                               <span className="text-sm font-medium capitalize">{influencer.platform}</span>
//                               {influencer.verified && (
//                                 <CheckCircle className="w-4 h-4 text-blue-500 ml-1" />
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                         {getSourceBadge(influencer.source)}
//                       </div>

//                       {/* Bio */}
//                       <p className="text-sm text-gray-600 mb-4 line-clamp-2">
//                         {influencer.bio}
//                       </p>

//                       {/* Stats */}
//                       <div className="grid grid-cols-2 gap-4 mb-4">
//                         <div>
//                           <p className="text-sm text-muted-foreground">Followers</p>
//                           <p className="font-semibold">{formatNumber(influencer.followers)}</p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-muted-foreground">Engagement</p>
//                           <p className="font-semibold">{influencer.engagement_rate.toFixed(1)}%</p>
//                         </div>
//                       </div>

//                       {/* Niche */}
//                       <div className="mb-4">
//                         <Badge variant="secondary" className="text-xs">
//                           {influencer.niche}
//                         </Badge>
//                       </div>

//                       {/* Location */}
//                       <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
//                         <MapPin className="w-3 h-3" />
//                         {influencer.location}
//                       </div>

//                       {/* Price */}
//                       {influencer.price_per_post && (
//                         <div className="mb-4 p-2 bg-muted rounded-md">
//                           <p className="text-sm font-medium text-center">
//                             💰 ${influencer.price_per_post} per post
//                           </p>
//                         </div>
//                       )}

//                       {/* Action Buttons */}
//                       <div className="flex gap-2">
//                         <Button className="flex-1" size="sm">
//                           Contact
//                         </Button>
//                         {influencer.profile_link && (
//                           <Button variant="outline" size="sm" asChild>
//                             <a href={influencer.profile_link} target="_blank" rel="noopener noreferrer">
//                               <ExternalLink className="w-4 h-4" />
//                             </a>
//                           </Button>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </CardSpotlight>
//               ))}
//             </div>
//           ) : (
//             <Card>
//               <CardContent className="py-16 text-center">
//                 <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold mb-2">No influencers found</h3>
//                 <p className="text-muted-foreground mb-4">
//                   Try adjusting your search query or filters
//                 </p>
//                 <Button variant="outline" onClick={() => setQuery('')}>
//                   Clear Search
//                 </Button>
//               </CardContent>
//             </Card>
//           )}
//         </>
//       )}

//       {/* Initial State */}
//       {!hasSearched && (
//         <Card>
//           <CardContent className="py-16 text-center">
//             <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">Start Your Search</h3>
//             <p className="text-muted-foreground">
//               Enter a search query above to find the perfect influencers for your campaign
//             </p>
//           </CardContent>
//         </Card>
//       )}
      
//       {/* Filter Editor Dialog */}
//       <FilterEditor
//         filters={extractedFilters || {}}
//         onFiltersChange={handleFiltersChange}
//         open={showFilterEditor}
//         onOpenChange={setShowFilterEditor}
//       />
//     </div>
//   )
// }

// // Mock data for demonstration - updated to match backend format
// const mockInfluencers: InfluencerProfile[] = [
//   {
//     id: '1',
//     name: 'Alex Tech',
//     username: 'alextech',
//     platform: 'youtube',
//     bio: 'Tech reviewer and gadget enthusiast. I love breaking down complex tech for everyday users.',
//     followers: 250000,
//     engagement_rate: 4.2,
//     price_per_post: 1200,
//     niche: 'Technology',
//     location: 'San Francisco, CA',
//     avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
//     verified: true,
//     source: 'on_platform',
//     profile_link: 'https://youtube.com/@alextech'
//   },
//   {
//     id: '2',
//     name: 'Sarah Style',
//     username: 'sarahstyle',
//     platform: 'instagram',
//     bio: 'Fashion blogger and lifestyle content creator. Bringing you the latest trends and styling tips.',
//     followers: 180000,
//     engagement_rate: 5.1,
//     price_per_post: 1500,
//     niche: 'Fashion',
//     location: 'New York, NY',
//     avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=150&h=150&fit=crop&crop=face',
//     verified: true,
//     source: 'on_platform',
//     profile_link: 'https://instagram.com/sarahstyle'
//   },
//   {
//     id: '3',
//     name: 'Mike Fitness',
//     username: 'mikefitness',
//     platform: 'instagram',
//     bio: 'Personal trainer and nutrition coach. Helping people achieve their fitness goals one workout at a time.',
//     followers: 95000,
//     engagement_rate: 6.8,
//     price_per_post: 600,
//     niche: 'Fitness',
//     location: 'Los Angeles, CA',
//     avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
//     verified: false,
//     source: 'external',
//     profile_link: 'https://instagram.com/mikefitness'
//   },
//   {
//     id: '4',
//     name: 'Emma Food',
//     username: 'emmafoodie',
//     platform: 'tiktok',
//     bio: 'Food blogger sharing delicious recipes and restaurant reviews from around the world.',
//     followers: 320000,
//     engagement_rate: 7.2,
//     price_per_post: 800,
//     niche: 'Food',
//     location: 'Austin, TX',
//     avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
//     verified: true,
//     source: 'external',
//     profile_link: 'https://tiktok.com/@emmafoodie'
//   }
// ]

// const mockFilters: SearchFilters = {
//   niche: 'Technology',
//   followers_min: 100000,
//   platform: 'youtube',
//   verified_only: false
// }
