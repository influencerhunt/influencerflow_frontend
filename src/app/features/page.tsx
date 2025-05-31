import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Platform Features</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Discover the powerful tools and capabilities that make InfluencerFlow the perfect choice for creators and brands
        </p>
      </div>

      {/* Core Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              👤 Role-Based Access
              <Badge variant="secondary">Security</Badge>
            </CardTitle>
            <CardDescription>
              Tailored experiences for different user types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Influencers:</strong> Portfolio management</li>
              <li>• <strong>Brands:</strong> Campaign creation tools</li>
              <li>• <strong>Admins:</strong> Platform oversight</li>
              <li>• <strong>Users:</strong> Basic discovery features</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Smart Matching
              <Badge variant="outline">AI-Powered</Badge>
            </CardTitle>
            <CardDescription>
              Intelligent brand-influencer pairing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Algorithm-based recommendations</li>
              <li>• Audience overlap analysis</li>
              <li>• Content style matching</li>
              <li>• Performance predictions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 Analytics Dashboard</CardTitle>
            <CardDescription>
              Comprehensive performance insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Real-time campaign metrics</li>
              <li>• Audience demographics</li>
              <li>• Engagement rate tracking</li>
              <li>• ROI calculations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💬 Communication Hub
              <Badge>Real-time</Badge>
            </CardTitle>
            <CardDescription>
              Seamless collaboration tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Direct messaging system</li>
              <li>• File sharing capabilities</li>
              <li>• Project timeline tracking</li>
              <li>• Video call integration</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>💰 Payment Management</CardTitle>
            <CardDescription>
              Secure and transparent transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Escrow payment protection</li>
              <li>• Multiple payment methods</li>
              <li>• Automated invoicing</li>
              <li>• Tax documentation</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📱 Mobile Optimized
              <Badge variant="secondary">Responsive</Badge>
            </CardTitle>
            <CardDescription>
              Full functionality on any device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Progressive Web App (PWA)</li>
              <li>• Touch-optimized interface</li>
              <li>• Offline capabilities</li>
              <li>• Push notifications</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator className="mb-12" />

      {/* For Influencers */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">For Influencers</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>🎨 Portfolio Builder</CardTitle>
              <CardDescription>
                Showcase your best work and attract brands
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Create stunning portfolios that highlight your content style, audience demographics, 
                and past collaboration successes.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Media Gallery</Badge>
                <Badge variant="outline">Analytics Display</Badge>
                <Badge variant="outline">Brand Guidelines</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📈 Growth Tools</CardTitle>
              <CardDescription>
                Insights and tools to grow your audience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Access detailed analytics about your audience, content performance, 
                and recommendations for growth strategies.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Audience Insights</Badge>
                <Badge variant="outline">Content Calendar</Badge>
                <Badge variant="outline">Trend Analysis</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* For Brands */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">For Brands</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>🎯 Campaign Manager</CardTitle>
              <CardDescription>
                Create and manage influencer campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Build comprehensive campaigns with clear objectives, timelines, 
                and performance metrics from start to finish.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Brief Creation</Badge>
                <Badge variant="outline">Timeline Management</Badge>
                <Badge variant="outline">Content Approval</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔍 Discovery Engine</CardTitle>
              <CardDescription>
                Find the perfect influencers for your brand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Advanced search and filtering tools to discover influencers 
                that align with your brand values and target audience.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Advanced Filters</Badge>
                <Badge variant="outline">AI Recommendations</Badge>
                <Badge variant="outline">Competitive Analysis</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="mb-8" />

      {/* CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle>Ready to Experience These Features?</CardTitle>
          <CardDescription>
            Join thousands of creators and brands already using InfluencerFlow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Schedule Demo</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 