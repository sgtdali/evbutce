import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ev Bütçesi | Akıllı Finans Yönetimi",
  description: "Ev bütçenizi kolayca takip edin, harcamalarınızı yönetin ve tasarruf yapmaya başlayın.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <main className="container">
          {children}
        </main>
        <footer style={{
          padding: '4rem 0',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.875rem'
        }}>
          &copy; {new Date().getFullYear()} EvBütçem - Tüm Hakları Saklıdır.
        </footer>
      </body>
    </html>
  );
}
