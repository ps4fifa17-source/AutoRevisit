export default function AnimatedSection({ children, delay = 0, className = "" }) {
  return <section className={`ar-section ${className}`} style={{ "--delay": `${delay}ms` }}>{children}</section>;
}
