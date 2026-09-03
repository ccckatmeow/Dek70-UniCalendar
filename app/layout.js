import "./globals.css";

export const metadata = {
  title: "ปฏิทินกำหนดการเข้ามหาวิทยาลัย",
  description: "ปฏิทินรวมกำหนดการและเอกสารสำหรับการเข้ามหาวิทยาลัย",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
