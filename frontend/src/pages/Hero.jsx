import { ArrowDownRight, Sparkles } from "lucide-react";
import Reveal from "../components/Reveal";

const Hero = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-glow" aria-hidden="true" />
      <Reveal className="hero-copy">
        <p className="eyebrow"><Sparkles size={14} /> A ritual after dark</p>
        <h1 id="hero-title" className="hero-title">Nocturne</h1>
        <p className="hero-tagline">Light in the dark.</p>
        <p className="hero-description">
          Find your quiet in the glow. A little warmth for the hours that are
          yours alone.
        </p>
        <button
          type="button"
          className="button button-glass hero-cta"
          onClick={scrollToProducts}
        >
          Shop Collection <ArrowDownRight size={17} />
        </button>
        <div className="hero-notes" aria-label="The Nocturne mood">
          <span>Slow evenings</span>
          <span>Low light</span>
          <span>Your own ritual</span>
        </div>
      </Reveal>
      <a className="hero-scroll" href="#about">
        <span>Scroll to discover</span>
        <span className="hero-scroll-line" />
      </a>
    </section>
  );
};

export default Hero;
