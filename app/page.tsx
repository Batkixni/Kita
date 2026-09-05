"use client";

import Image from "next/image";
import { BlueSkyBackground } from "@/components/backgrounds/BlueSkyBackground";
import { TeamSection } from "@/components/TeamSection";
import { PortfolioGrid } from "@/components/PortfolioGrid";

export default function Home() {
  return (
    <>
      <BlueSkyBackground />

      <main
        className="main-container"
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "8rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          margin: "0 auto",
          width: "100%",
          maxWidth: "100%",
          backgroundColor: "transparent",
          color: "white",
        }}
      >
        <div style={{ width: "100%", maxWidth: "320px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <Image
              src="/logo/Logotype_3_W.png"
              alt="STUDIO SORAI"
              width={320}
              height={86}
              style={{ width: "180px", height: "auto" }}
              priority
            />
          </div>

          <p style={{ fontSize: "14px", lineHeight: "1.6", opacity: 0.7 }}>
            indie creative studio.
            <br />
            focused on esport broadcast and event visual.
            <br />
            contact: studio@sorai.tw
            <br />
            <br />
            <a
              href="mailto:studio@sorai.tw"
              style={{
                opacity: 0.5,
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
            >
              get in touch
            </a>{" "}
            if you want to collaborate.
          </p>

          <TeamSection />

          <PortfolioGrid />

          <footer
            style={{
              marginTop: "4rem",
              paddingTop: "2rem",
              paddingBottom: "2rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.2)",
              fontSize: "11px",
              opacity: 0.4,
              textAlign: "center",
            }}
          >
            © 2026 STUDIO SORAI. All rights reserved.
          </footer>
        </div>
      </main>

      <style jsx global>{`
        @media (min-width: 1024px) {
          .main-container {
            width: 70% !important;
            max-width: 70% !important;
          }
        }
      `}</style>
    </>
  );
}
