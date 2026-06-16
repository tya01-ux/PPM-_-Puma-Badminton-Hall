import {Hero} from "../components/Home/Hero";
import { Features } from "../components/Home/Features";

export default function Homepage() {
  return (
    <main className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      
      <Features />

    </main>
  );
}

