import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e7490",
          borderRadius: 8,
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 36 36"
          fill="none"
        >
          <path
            d="M10 24V12h4.2c3.2 0 5 1.8 5 3.7 0 1.9-1.9 3.8-5 3.8v4.5H10zm4.2-6.5h2c1.1 0 1.8-.6 1.8-1.5 0-.9-.7-1.5-1.8-1.5h-2z"
            fill="white"
          />
          <path
            d="M22.5 12h3.5l5 12h-3.7l-.9-2.3h-4.5l-.9 2.3H17l5.5-12zm2.2 7.1l-1.5-3.8-1.5 3.8h3z"
            fill="#A5F3FC"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
