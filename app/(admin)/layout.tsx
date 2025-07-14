import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CIIMED",
  description: "Centro de Investigación e Innovación Médica de Panamá",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}
