import { NextRequest, NextResponse } from "next/server";

const PLACEHOLDER_SVG = `<svg width=\"400\" height=\"300\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"#dadada\"><rect width=\"100%\" height=\"100%\"/><text x=\"200\" y=\"160\" font-size=\"36\" fill=\"#888\" text-anchor=\"middle\">No Image</text></svg>`;
const PEXELS_API_KEY = "AMQuMWtLOLfC7fbtfqVrAaGcVLSbpT7jMd06mDjZD1NMwNCAwLl6cn4g";
const PEXELS_API_URL = "https://api.pexels.com/v1/search";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const itemName = searchParams.get("name");

  if (!itemName) {
    return new NextResponse(PLACEHOLDER_SVG, {
      status: 200,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }

  try {
    // Search Pexels for photos matching the item name
    const pexelsRes = await fetch(`${PEXELS_API_URL}?query=${encodeURIComponent(itemName)}&per_page=1`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      cache: "no-store"
    });

    if (!pexelsRes.ok) {
      throw new Error("Pexels API request failed");
    }

    const data = await pexelsRes.json();
    const photo = data.photos && data.photos[0];

    if (!photo || !photo.src || !photo.src.medium) {
      throw new Error("No image found on Pexels");
    }

    // Fetch the actual image binary from the direct photo URL
    const imgRes = await fetch(photo.src.medium, { cache: "no-store" });
    if (!imgRes.ok) {
      throw new Error("Could not fetch Pexels image binary");
    }
    const buffer = await imgRes.arrayBuffer();

    // Return the image with correct Content-Type header
    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        "Content-Type": imgRes.headers.get("content-type") || "image/jpeg",
        "Content-Length": buffer.byteLength.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    // On error, return the embedded SVG placeholder
    return new NextResponse(PLACEHOLDER_SVG, {
      status: 200,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }
}