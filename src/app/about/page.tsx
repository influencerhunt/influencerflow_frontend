import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About InfluencerFlow</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Connecting influencers and brands through modern technology and seamless user experience
        </p>
      </div>

      {/* Mission Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
          <CardDescription>
            Building the future of influencer marketing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            InfluencerFlow is designed to bridge the gap between talented content creators and innovative brands. 
            We believe in creating meaningful partnerships that drive authentic engagement and measurable results.
          </p>
          <p>
            Our platform leverages cutting-edge technology to provide seamless collaboration tools, 
            transparent analytics, and streamlined campaign management for all stakeholders.
          </p>
        </CardContent>
      </Card>

      {/* Values Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Authenticity
              <Badge variant="secondary">Core Value</Badge>
            </CardTitle>
            <CardDescription>
              We prioritize genuine connections and authentic content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Every partnership on our platform is built on trust, transparency, and genuine brand alignment. 
              We help creators maintain their authentic voice while delivering value to brands.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚀 Innovation
              <Badge variant="outline">Technology</Badge>
            </CardTitle>
            <CardDescription>
              Leveraging the latest technology for better experiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Built with Next.js 15.3, React 19, and Tailwind CSS 4, our platform delivers 
              lightning-fast performance and modern user experiences across all devices.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🤝 Community</CardTitle>
            <CardDescription>
              Fostering meaningful relationships in the creator economy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              We're more than a platform - we're a community of creators, brands, and innovators 
              working together to shape the future of digital marketing.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📈 Growth</CardTitle>
            <CardDescription>
              Empowering creators and brands to achieve their goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Our tools and insights help creators grow their audience while enabling brands 
              to reach their target markets more effectively than ever before.
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator className="mb-8" />

      {/* Team Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Built by Developers, for Creators</CardTitle>
          <CardDescription>
            Our team combines technical expertise with deep understanding of the creator economy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Founded by a team of developers and digital marketing experts, InfluencerFlow was born 
            from the need for better tools in the rapidly evolving creator economy.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge>Full-Stack Development</Badge>
            <Badge variant="secondary">UI/UX Design</Badge>
            <Badge variant="outline">Digital Marketing</Badge>
            <Badge>Data Analytics</Badge>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle>Ready to Join InfluencerFlow?</CardTitle>
          <CardDescription>
            Whether you're a creator or a brand, we'd love to have you in our community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 