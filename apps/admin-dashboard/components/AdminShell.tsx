import Link from "next/link";
import type { ReactNode } from "react";

type IconName =
  | "home"
  | "clinic"
  | "queue"
  | "chart"
  | "people"
  | "calendar"
  | "pill"
  | "report"
  | "bell"
  | "settings"
  | "scan"
  | "message";

type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  badge?: string;
};

const adminNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/clinics", label: "Clinics", icon: "clinic" },
  { href: "/queues", label: "Queue Management", icon: "queue" },
  { href: "/analytics", label: "Queue Analytics", icon: "chart" },
  { href: "/patients", label: "Patients", icon: "people" },
  { href: "/appointments", label: "Appointments", icon: "calendar" },
  { href: "/medications", label: "Medication Stock", icon: "pill" },
  { href: "/staff", label: "Staff Management", icon: "people" },
  { href: "/reports", label: "Reports", icon: "report" },
  { href: "/alerts", label: "Alerts", icon: "bell", badge: "6" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

const staffNav: NavItem[] = [
  { href: "/staff-app", label: "STAFF APP", icon: "home" },
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/scanner", label: "Nurse Quick Scanner", icon: "scan" },
  { href: "/queues", label: "Queue Management", icon: "queue" },
  { href: "/patients", label: "Patients", icon: "people" },
  { href: "/appointments", label: "Appointments", icon: "calendar" },
  { href: "/medications", label: "Medication Stock", icon: "pill" },
  { href: "/reports", label: "Reports", icon: "report" },
  { href: "/messages", label: "Messages", icon: "message", badge: "2" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export function AdminShell({
  active,
  mode = "admin",
  children,
}: {
  active: string;
  mode?: "admin" | "staff";
  children: ReactNode;
}) {
  const nav = mode === "staff" ? staffNav : adminNav;
  const profileName = mode === "staff" ? "Nomsa Dlamini" : "Admin";
  const profileRole = mode === "staff" ? "Enrolled Nurse" : "Super Admin";
  const avatar =
    mode === "staff"
      ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80"
      : "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&q=80";

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mode === "staff" ? "sidebar-light" : ""}`}>
        <Logo />
        <div className="nav-label">{mode === "staff" ? "STAFF APP" : "ADMIN PANEL"}</div>
        <nav className="nav" aria-label="Main navigation">
          {nav.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={`nav-item ${item.href === active ? "active" : ""}`}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.badge ? <span className="badge">{item.badge}</span> : null}
            </Link>
          ))}
        </nav>
        {mode === "staff" ? <StaffStatus /> : null}
        <SupportCard />
      </aside>
      <main className="main">
        <header className="topbar">
          <button className="hamburger" aria-label="Open menu">
            <Icon name="queue" />
          </button>
          <div className="top-actions">
            <div className="bell" aria-label="Notifications">
              <Icon name="bell" />
              <span className="badge">{mode === "staff" ? "3" : "6"}</span>
            </div>
            <div className="profile-chip">
              <img className="avatar" src={avatar} alt="" />
              <div>
                <strong>{profileName}</strong>
                <span>{profileRole}</span>
              </div>
              <span aria-hidden>⌄</span>
            </div>
          </div>
        </header>
        {children}
        {mode === "staff" ? (
          <nav className="bottom-nav-preview" aria-label="Staff mobile navigation">
            <Link href="/dashboard">Home</Link>
            <Link href="/patients">Patients</Link>
            <Link className="active" href="/scanner">Scan QR</Link>
            <Link href="/queues">Queue</Link>
            <Link href="/settings">Profile</Link>
          </nav>
        ) : null}
      </main>
    </div>
  );
}

export function Logo() {
  return (
    <Link href="/staff" className="brand">
      <div className="logo-mark">+</div>
      <div className="brand-text">
        Clinic<span className="q">Q</span>
      </div>
    </Link>
  );
}

function SupportCard() {
  return (
    <div className="support-card">
      <h3>Need help?</h3>
      <p>Contact support for assistance.</p>
      <button className="support-button">Contact Support</button>
    </div>
  );
}

function StaffStatus() {
  return (
    <div className="staff-status-card" style={{ marginTop: "auto", marginBottom: 20 }}>
      <p style={{ marginBottom: 8 }}>You are</p>
      <h3 style={{ color: "var(--primary)" }}>● On Duty</h3>
      <p>General Consultation<br />08:00 - 16:00</p>
      <p style={{ marginBottom: 0 }}>Langa Community Clinic</p>
    </div>
  );
}

export function Icon({ name }: { name: IconName }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<IconName, ReactNode> = {
    home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h5v-6h4v6h5V10" /></>,
    clinic: <><path d="M4 20h16V6H4z" /><path d="M12 10v6M9 13h6" /><path d="M8 6V4h8v2" /></>,
    queue: <><path d="M4 7h16M4 12h16M4 17h16" /><path d="M8 5v4M12 10v4M16 15v4" /></>,
    chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 15l3-4 3 2 4-7" /></>,
    people: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" /><circle cx="17" cy="9" r="2" /><path d="M20 20c0-2-1.4-3.5-3.3-4" /></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></>,
    pill: <><path d="M10 21a5 5 0 0 1-3.5-8.5l6-6A5 5 0 1 1 19.5 13l-6 6A5 5 0 0 1 10 21z" /><path d="M9 9l6 6" /></>,
    report: <><path d="M6 3h9l3 3v15H6z" /><path d="M14 3v4h4M9 13h6M9 17h6M9 9h2" /></>,
    bell: <><path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16z" /><path d="M10 21h4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.8-1L14.4 3h-4.8L9.2 6a7 7 0 0 0-1.8 1L5 6 3 9.5 5 11a7 7 0 0 0 0 2l-2 1.5L5 18l2.4-1a7 7 0 0 0 1.8 1l.4 3h4.8l.4-3a7 7 0 0 0 1.8-1l2.4 1 2-3.5-2-1.5a7 7 0 0 0 .1-1z" /></>,
    scan: <><path d="M5 8V5h3M16 5h3v3M19 16v3h-3M8 19H5v-3" /><path d="M8 12h8" /></>,
    message: <><path d="M4 5h16v11H8l-4 4z" /></>,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {paths[name]}
    </svg>
  );
}
