"use client";

import { sidebarItems } from "@/data/dashboard";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { logout } from "../../app/lib/auth";

const NAV_ITEMS = sidebarItems.filter((elm) => elm.label !== "Logout");
const LOGOUT_ITEM = sidebarItems.find((elm) => elm.label === "Logout");

const SIDEBAR_BG   = "linear-gradient(180deg,#1a1f4e 0%,#141840 100%)";
const ACCENT       = "#ea3c3c";
const ITEM_H       = 52;
const ITEM_RADIUS  = 12;

export default function Sidebar({ setSideBarOpen }) {
  const pathname = usePathname();

  return (
    <div
      className="dashboard__sidebar js-dashboard-sidebar"
      style={{
        display: "flex",
        flexDirection: "column",
        background: SIDEBAR_BG,
        overflow: "hidden",
      }}
    >
      {/* ── Logo header ── */}
      <div
        className="dashboard__sidebar_header"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 80,
          flexShrink: 0,
          borderBottom: "1px solid rgba(255,255,255,.08)",
          background: "rgba(0,0,0,.12)",
        }}
      >
        <span
          className="closeSidebar"
          onClick={() => setSideBarOpen(false)}
          style={{
            position: "absolute",
            top: "50%",
            right: 16,
            transform: "translateY(-50%)",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            background: "rgba(255,255,255,.1)",
            color: "rgba(255,255,255,.7)",
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          ×
        </span>
        <Link href="/">
          <Image
            width={120}
            height={26}
            src="/img/general/logo-3.png"
            alt="Rapid Ease"
            priority
            style={{ objectFit: "contain", display: "block" }}
          />
        </Link>
      </div>

      {/* ── Nav label ── */}
      <div
        style={{
          padding: "22px 20px 8px",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,.3)",
        }}
      >
        Navigation
      </div>

      {/* ── Nav items ── */}
      <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
        {NAV_ITEMS.map((elm) => {
          const isActive = pathname === elm.href;
          return (
            <Link
              key={elm.id}
              href={elm.href}
              onClick={() => elm.label === "Logout" && logout()}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                height: ITEM_H,
                padding: "0 16px",
                borderRadius: ITEM_RADIUS,
                textDecoration: "none",
                background: isActive ? "rgba(255,255,255,.12)" : "transparent",
                color: isActive ? "#ffffff" : "rgba(255,255,255,.6)",
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                transition: "background .18s, color .18s",
                position: "relative",
                borderLeft: isActive ? `3px solid ${ACCENT}` : "3px solid transparent",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,.07)";
                  e.currentTarget.style.color = "rgba(255,255,255,.9)";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,.6)";
                }
              }}
            >
              <i
                className={elm.iconClass}
                style={{
                  fontSize: 20,
                  display: "flex",
                  flexShrink: 0,
                  color: isActive ? ACCENT : "rgba(255,255,255,.45)",
                  width: 22,
                  justifyContent: "center",
                }}
              />
              <span style={{ lineHeight: 1 }}>{elm.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Logout footer ── */}
      {LOGOUT_ITEM && (
        <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,.07)", flexShrink: 0 }}>
          <Link
            href={LOGOUT_ITEM.href}
            onClick={() => logout()}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              height: ITEM_H,
              padding: "0 16px",
              borderRadius: ITEM_RADIUS,
              background: "rgba(234,60,60,.1)",
              color: "rgba(234,60,60,.85)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
              transition: "background .18s, color .18s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(234,60,60,.2)";
              e.currentTarget.style.color = "#ea3c3c";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(234,60,60,.1)";
              e.currentTarget.style.color = "rgba(234,60,60,.85)";
            }}
          >
            <i
              className={LOGOUT_ITEM.iconClass}
              style={{ fontSize: 20, display: "flex", flexShrink: 0, width: 22, justifyContent: "center", color: "inherit" }}
            />
            <span style={{ lineHeight: 1 }}>Logout</span>
          </Link>
        </div>
      )}
    </div>
  );
}
