export const metadata = {
  title: "Srilekha Paul | Asparint Full Stack Developer",
  description: "Modern pink themed portfolio with teddy aesthetic",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}