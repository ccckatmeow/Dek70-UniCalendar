import { NextResponse } from "next/server";

function detectPlatform(hostname) {
  const h = hostname.replace(/^www\./, "");
  if (h.includes("youtube.com") || h === "youtu.be") return "youtube";
  if (h.includes("instagram.com")) return "instagram";
  if (h.includes("tiktok.com")) return "tiktok";
  return "other";
}

// ดึงค่า <meta property="og:xxx" content="..."> (รองรับสลับลำดับ property/content ในแท็ก)
function extractMeta(html, property) {
  const pattern1 = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`,
    "i"
  );
  const pattern2 = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${property}["']`,
    "i"
  );
  const m1 = html.match(pattern1);
  if (m1) return m1[1];
  const m2 = html.match(pattern2);
  if (m2) return m2[1];
  return null;
}

function extractTitleTag(html) {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m ? m[1].trim() : null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "missing url" }, { status: 400 });
  }

  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  const platform = detectPlatform(parsed.hostname);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        // บางเว็บบล็อก request ที่ไม่มี User-Agent เหมือนเบราว์เซอร์จริง
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({
        platform,
        title: null,
        image: null,
        siteName: parsed.hostname,
        ok: false,
      });
    }

    const html = await res.text();

    const title =
      extractMeta(html, "og:title") ||
      extractMeta(html, "twitter:title") ||
      extractTitleTag(html);
    const image = extractMeta(html, "og:image") || extractMeta(html, "twitter:image");
    const siteName = extractMeta(html, "og:site_name") || parsed.hostname;

    return NextResponse.json({ platform, title, image, siteName, ok: true });
  } catch (err) {
    // เว็บบางที่ (เช่น Instagram บางโพสต์) บล็อกการดึงข้อมูลแบบนี้ — ให้ fallback
    // เป็นแค่แสดงลิงก์เฉยๆ แทน ไม่ทำให้โพสต์ไม่สำเร็จ
    return NextResponse.json({
      platform,
      title: null,
      image: null,
      siteName: parsed.hostname,
      ok: false,
    });
  }
}
