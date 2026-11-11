import { createElement, useEffect, useRef, useState } from "react";

const Reveal = ({ as = "div", className = "", delay = 0, children }) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.08 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref: elementRef,
      className: `reveal ${isVisible ? "is-visible" : ""} ${className}`.trim(),
      style: { "--reveal-delay": `${delay}ms` },
    },
    children
  );
};

export default Reveal;
