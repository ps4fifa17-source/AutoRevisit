function hexToRgb(hex) {
  const value = String(hex || "#111315").replace("#", "");
  const full = value.length === 3 ? value.split("").map((x) => x + x).join("") : value;
  const int = parseInt(full, 16);
  if (Number.isNaN(int)) return [17, 19, 21];
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function modeTheme(mode, primary) {
  const [r, g, b] = hexToRgb(primary);
  const glow = `rgba(${r}, ${g}, ${b}, .34)`;
  const soft = `rgba(${r}, ${g}, ${b}, .13)`;
  const base = {
    "--dealer-primary": primary,
    "--dealer-primary-soft": soft,
    "--dealer-accent": primary,
    "--dealer-glow": glow,
  };

  if (mode === "performance") {
    return {
      ...base,
      "--dealer-bg": `radial-gradient(circle at 78% 6%, ${glow}, transparent 28%), linear-gradient(180deg, #07090d 0%, #121111 48%, #050506 100%)`,
      "--dealer-card": "rgba(255,255,255,.065)",
      "--dealer-text": "#ffffff",
      "--dealer-muted": "rgba(255,255,255,.6)",
      "--dealer-border": "rgba(255,255,255,.11)",
    };
  }

  if (mode === "premium") {
    return {
      ...base,
      "--dealer-bg": `radial-gradient(circle at 50% 0%, ${glow}, transparent 30%), linear-gradient(180deg, #080808 0%, #11100d 54%, #050505 100%)`,
      "--dealer-card": "rgba(255,255,255,.055)",
      "--dealer-text": "#f8f3e8",
      "--dealer-muted": "rgba(248,243,232,.62)",
      "--dealer-border": "rgba(255,255,255,.12)",
    };
  }

  if (mode === "family") {
    return {
      ...base,
      "--dealer-bg": "linear-gradient(180deg, #fbf8f1 0%, #f5f1e8 100%)",
      "--dealer-card": "rgba(255,255,255,.77)",
      "--dealer-text": "#101014",
      "--dealer-muted": "rgba(16,16,20,.58)",
      "--dealer-border": "rgba(120,90,50,.12)",
    };
  }

  if (mode === "firstcar" || mode === "first_car") {
    return {
      ...base,
      "--dealer-bg": "linear-gradient(180deg, #f8f9ff 0%, #f4f7fb 100%)",
      "--dealer-card": "rgba(255,255,255,.84)",
      "--dealer-text": "#101014",
      "--dealer-muted": "rgba(16,16,20,.58)",
      "--dealer-border": "rgba(30,60,120,.09)",
    };
  }

  if (mode === "executive") {
    return {
      ...base,
      "--dealer-bg": "#f4f4f1",
      "--dealer-card": "#ffffff",
      "--dealer-text": "#101014",
      "--dealer-muted": "rgba(16,16,20,.58)",
      "--dealer-border": "rgba(0,0,0,.08)",
    };
  }

  if (mode === "enquiry") {
    return {
      ...base,
      "--dealer-bg": "linear-gradient(180deg, #ffffff 0%, #f7f7f4 100%)",
      "--dealer-card": "rgba(255,255,255,.86)",
      "--dealer-text": "#101014",
      "--dealer-muted": "rgba(16,16,20,.58)",
      "--dealer-border": "rgba(0,0,0,.08)",
    };
  }

  return {
    ...base,
    "--dealer-bg": mode === "finance" ? "linear-gradient(180deg, #ffffff 0%, #f5f5f1 100%)" : "#f7f7f4",
    "--dealer-card": "rgba(255,255,255,.82)",
    "--dealer-text": "#101014",
    "--dealer-muted": "rgba(16,16,20,.58)",
    "--dealer-border": "rgba(0,0,0,.08)",
  };
}

export default function DealerPageShell({ dealer, mode, children }) {
  const primary = dealer?.primary_color || "#111315";
  return (
    <main className="ar-page-shell" style={modeTheme(mode, primary)}>
      <div className="ar-mobile-page">{children}</div>
    </main>
  );
}
