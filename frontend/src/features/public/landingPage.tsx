import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import HeroSectionToggle from "@/src/features/public/components/sections/hero/HeroSectionToggle";
import CategoryStrip from "@/src/features/public/components/sections/CategoryStrip";
import FeaturedSectionToggle from "@/src/features/public/components/sections/featured/FeaturedSectionToggle";
import ProductCatalog from "@/src/features/public/components/sections/ProductsCatalog";
import CategoryCarouselSection from "@/src/features/public/components/sections/CategoryCarouselSection";
import ReviewsSection from "@/src/features/public/components/sections/ReviewSection";
import AboutUsSection from "@/src/features/public/components/sections/AboutUsSection";
import SocialsSection from "@/src/features/public/components/sections/SocialsSection";
import OmegaStories from "@/src/features/public/components/sections/OmegaStories";
import ContactSection from "@/src/features/public/components/sections/ContactSection";

// Data Imports
import { heroData } from "@/src/data/heroData";
import { categoriesData } from "@/src/data/categoriesData";
import { productsData } from "@/src/data/products";
import { categoryHighlightsData, socialAccountsData } from "@/src/data/socialsData";
import { blogsData } from "@/src/data/blogsData";
import { reviewsData } from "@/src/data/reviewsData";
export default function Home() {

  return (
    <div className="flex flex-col w-full bg-white">
      <Header />
      <HeroSectionToggle data={heroData} />
      <CategoryStrip categories={categoriesData} />
      <FeaturedSectionToggle />
      <ProductCatalog products={productsData} />

      
      {categoryHighlightsData.map((highlight) => (
        <CategoryCarouselSection 
          key={highlight.categoryId}
          id={highlight.categoryId}
          title={highlight.title}
          subtitle={highlight.subtitle}
          items={highlight.items}
          bgColor={highlight.bgColor}
          floatingImageScale={highlight.floatingImageScale}
        />
      ))}

      <OmegaStories stories={blogsData} />
      <ReviewsSection reviews={reviewsData} />
      <SocialsSection data={socialAccountsData} />
      <AboutUsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}