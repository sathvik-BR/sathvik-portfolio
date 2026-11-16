import { Navbar, Preloader, Cursor } from "@/components/ui";
import { Hero, About, Projects, Skills, Certifications, Contact } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Preloader />
      <Cursor />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Certifications />
        <Contact />
      </main>
    </>
  );
}