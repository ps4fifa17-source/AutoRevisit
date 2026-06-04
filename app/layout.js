import "./globals.css";

export const metadata = {
  title: "Signal",
  description: "Dealer customer page platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
