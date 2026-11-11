export default function Footer() {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Nocturne · Light in the dark.</span>
      <span className="footer-credit">
        Prabhav Sharma ·{" "}
        <a href="mailto:prabhavs2004@gmail.com">prabhavs2004@gmail.com</a>
      </span>
    </footer>
  );
}
