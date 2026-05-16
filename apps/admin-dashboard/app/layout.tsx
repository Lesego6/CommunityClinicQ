import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "ClinicQ Admin",
  description: "ClinicQ admin and staff dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
