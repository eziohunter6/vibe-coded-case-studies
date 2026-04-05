import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redesigning Spinny's homepage for committed buyers",
  description:
    "After booking a test drive, users returned to the exact same homepage as a first-time visitor. No booking detail. No next step. No acknowledgement they'd said yes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
