import { Hero } from "../components/Home/Hero";
import { Features } from "../components/Home/Features";
import { FacilitiesSchedule } from "../components/Home/Fasititass";
import { PromoBanner } from "../components/Home/Benners";
import { MembershipPreview } from "../components/Home/Membershippreview";
import { Gallery } from "../components/Home/galeri";
import { BookingCTA } from "../components/Home/Bookingcta";

export default function Homepage() {
  return (
    <main className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <Hero />

      {/* Features Section (sudah include "Kenapa Memilih Kami" + "Produk Kami") */}
      <Features />

      {/* Facilities & Today's Schedule Section */}
      <FacilitiesSchedule />

      {/* Galeri Fasilitas Section */}
      <Gallery />

      {/* Product & Membership Promo Section */}
      <PromoBanner />

      {/* Membership Preview Section */}
      <MembershipPreview />

      {/* Booking CTA Section */}
      <BookingCTA />

    </main>
  );
}