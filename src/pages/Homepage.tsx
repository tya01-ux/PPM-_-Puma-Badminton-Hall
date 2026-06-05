import {Hero} from "../components/Hero";
import { Features } from "../components/Features";

export default function Homepage() {
  return (
    <main className="min-h-screen bg-blue-50 flex flex-col">

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

    </main>
  );
}

