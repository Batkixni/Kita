"use client";

import Image from "next/image";
import { PixelDyeBackground } from "@/components/backgrounds/PixelDyeBackground";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <>
      <PixelDyeBackground />

      {/* Main container - 70% width on desktop */}
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
          color: "black",
          transition: "background-color 0.3s, color 0.3s",
        }}
      >
        <div style={{ width: "100%", maxWidth: "320px" }}>
          {/* Logo - switches between black and white versions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <div className="logo-light">
              <Image
                src="/logo/Logotype_3.png"
                alt="STUDIO SORAI"
                width={320}
                height={80}
                style={{ width: "180px", height: "auto" }}
                priority
              />
            </div>
            <div className="logo-dark" style={{ display: "none" }}>
              <Image
                src="/logo/Logotype_3_W.png"
                alt="STUDIO SORAI"
                width={320}
                height={80}
                style={{ width: "180px", height: "auto" }}
                priority
              />
            </div>
            <ThemeToggle />
          </div>

          <p style={{ fontSize: "14px", lineHeight: "1.6", opacity: 0.7 }}>
            indie creative studio.
            <br />
            focused on esport broadcast and event visual.
            <br />
            contact: hello@bax.visual
            <br />
            <br />
            <a
              href="mailto:hello@bax.visual"
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
        </div>
      </main>

      {/* CSS for responsive width and dark mode */}
      <style jsx global>{`
        @media (min-width: 1024px) {
          .main-container {
            width: 70% !important;
            max-width: 70% !important;
          }
        }

        /* Dark mode styles */
        html.dark .main-container {
          color: #f5f5f5 !important;
        }

        html.dark .logo-light {
          display: none !important;
        }

        html.dark .logo-dark {
          display: block !important;
        }
      `}</style>
    </>
  );
}
