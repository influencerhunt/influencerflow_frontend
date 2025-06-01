import { HeroWithMockup } from "@/components/blocks/hero-with-mockup"

export function HomeLanding() {
  return (
    <HeroWithMockup
      title="Build AI-powered apps in minutes, not months"
      description="Create sophisticated AI applications with our intuitive platform. No ML expertise required."
      primaryCta={{
        text: "Get Started",
        href: "/signup",
      }}
      secondaryCta={{
        text: "Watch our Demo",
        href: "/demo",
      }}
      mockupImage={{
        alt: "AI Platform Dashboard",
        width: 1248,
        height: 765,
        src: "https://www.launchuicomponents.com/app-light.png"
      }}
    />
  )
}