/**
 * Decorative hero backdrop — a single cohesive indigo→violet glow.
 * Two large, heavily-overlapping blobs in the same colour family read as one
 * soft wash (not three separate patches). Pure CSS, so it stays a server
 * component. Animations live in globals.css and respect reduced-motion.
 */
export function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* faint tech grid, fading out downward */}
      <div className="bg-lines absolute inset-0 opacity-70" />

      {/* one unified glow band near the top */}
      <div
        className="aurora-blob h-[34rem] w-[34rem] bg-brand-400/35"
        style={{ top: "-12rem", left: "18%", animationDelay: "0s" }}
      />
      <div
        className="aurora-blob h-[30rem] w-[30rem] bg-violet-400/35"
        style={{ top: "-10rem", right: "16%", animationDelay: "-7s" }}
      />
      <div
        className="aurora-blob h-[26rem] w-[26rem] bg-brand-300/25"
        style={{ top: "-6rem", left: "42%", animationDelay: "-3.5s" }}
      />
    </div>
  );
}
