import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";

export default function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <main>
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
