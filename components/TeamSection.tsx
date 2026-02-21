"use client";

import Image from "next/image";
import Link from "next/link";
import { teamMembers } from "@/lib/team";

export function TeamSection() {
  return (
    <div style={{ marginTop: "3rem" }}>
      <div
        style={{
          fontSize: "12px",
          opacity: 0.5,
          marginBottom: "1rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Team
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {teamMembers.map((member) => (
          <Link
            key={member.id}
            href={member.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              width: "64px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: "rgba(128, 128, 128, 0.1)",
                flexShrink: 0,
              }}
            >
              <Image
                src={member.avatar}
                alt={member.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="56px"
              />
            </div>
            <div
              style={{
                fontSize: "10px",
                marginTop: "6px",
                textAlign: "center",
                opacity: 0.8,
                lineHeight: 1.2,
              }}
            >
              {member.name}
            </div>
            <div
              style={{
                fontSize: "9px",
                textAlign: "center",
                opacity: 0.4,
                lineHeight: 1.2,
              }}
            >
              {member.role}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
