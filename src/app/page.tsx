import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";
import { FeaturedTimepieces } from "@/components/sections/featured-timepieces";
import { Collections } from "@/components/sections/collections";
import { NewArrivals } from "@/components/sections/new-arrivals";
import { Craftsmanship } from "@/components/sections/craftsmanship";
import { Newsletter } from "@/components/sections/newsletter";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <FeaturedTimepieces />
        <Collections />
        <NewArrivals />
        <Craftsmanship />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
