import "./globals.css";

export const metadata = {
  title: "ปฏิทินกำหนดการเข้ามหาวิทยาลัย Dek70 🥹💖",
  description: "ปฏิทินรวมกำหนดการและเอกสารสำหรับการเข้ามหาวิทยาลัย",
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning จำเป็นเพราะสคริปต์ด้านล่างเซ็ต class="dark" ก่อน React hydrate
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* เปลี่ยนจาก Prompt → Mali (ลายมือกลมๆ เข้ากับสไตล์ doodle ของโลโก้) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Mali:wght@400;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* กัน "จอกระพริบ" ตอนโหลด dark mode ครั้งแรก ต้องอยู่ก่อน children */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var saved = localStorage.getItem('dek70-theme');
                var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') document.documentElement.classList.add('dark');
              } catch (e) {}
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
