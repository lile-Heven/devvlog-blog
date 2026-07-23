import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/types";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? SITE_CONFIG.name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(ellipse at 30% 50%, rgba(0,245,212,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(127,216,255,0.04) 0%, transparent 60%)",
          padding: "60px",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #00F5D4, #7FD8FF, #00F5D4)",
          }}
        />

        {/* Site name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              border: "1px solid rgba(0,245,212,0.3)",
              background: "rgba(0,245,212,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#00F5D4",
              fontSize: "20px",
            }}
          >
            {"</>"}
          </div>
          <span
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "-0.5px",
            }}
          >
            DevVlog
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 40 ? "42px" : "52px",
            fontWeight: 700,
            color: "rgba(255,255,255,0.95)",
            textAlign: "center",
            lineHeight: 1.3,
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "20px",
            color: "rgba(255,255,255,0.38)",
          }}
        >
          {SITE_CONFIG.description}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
