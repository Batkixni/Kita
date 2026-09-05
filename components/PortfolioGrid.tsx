"use client";

import Link from "next/link";
import { portfolioItems } from "@/lib/portfolio";

export function PortfolioGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1rem",
        marginTop: "3rem",
      }}
    >
      {portfolioItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
          style={{
            display: "block",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div
            style={{
              position: "relative",
              aspectRatio: "16 / 9",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "rgba(128, 128, 128, 0.1)",
              backgroundImage: `url(${item.thumbnail})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div style={{ marginTop: "0.5rem" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 500,
                opacity: 0.9,
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                fontSize: "11px",
                opacity: 0.5,
                marginTop: "2px",
              }}
            >
              {item.credit}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
