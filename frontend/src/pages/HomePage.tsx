import { HeroSection } from "@/components/sections/HeroSection";
import { SearchSection } from "@/components/sections/SearchSection";
import { StatisticsSection } from "@/components/sections/StatisticsSection";
import { PracticeAreasSection } from "@/components/sections/PracticeAreasSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { FeaturedLawyersSection } from "@/components/sections/FeaturedLawyersSection";
import { SuccessStoriesSection } from "@/components/sections/SuccessStoriesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CTABannerSection } from "@/components/sections/CTABannerSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchSection />
      <StatisticsSection />
      <PracticeAreasSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <FeaturedLawyersSection />
      <SuccessStoriesSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />
      <ContactSection />
      <CTABannerSection />
    </>
  );
}
