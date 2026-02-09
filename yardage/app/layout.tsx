import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

import LocalFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const haskoy = LocalFont({
  src: [
    { path: "../public/fonts/Haskoy-Thin.otf", weight: "100", style: "normal" },
    { path: "../public/fonts/Haskoy-ThinItalic.otf", weight: "100", style: "italic" },
    { path: "../public/fonts/Haskoy-ExtraLight.otf", weight: "200", style: "normal" },
    { path: "../public/fonts/Haskoy-ExtraLightItalic.otf", weight: "200", style: "italic" },
    { path: "../public/fonts/Haskoy-Light.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/Haskoy-LightItalic.otf", weight: "300", style: "italic" },
    { path: "../public/fonts/Haskoy-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/Haskoy-Italic.otf", weight: "400", style: "italic" },
    { path: "../public/fonts/Haskoy-Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/Haskoy-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "../public/fonts/Haskoy-SemiBold.otf", weight: "600", style: "normal" },
    { path: "../public/fonts/Haskoy-SemiBoldItalic.otf", weight: "600", style: "italic" },
    { path: "../public/fonts/Haskoy-Bold.otf", weight: "700", style: "normal" },
    { path: "../public/fonts/Haskoy-BoldItalic.otf", weight: "700", style: "italic" },
    { path: "../public/fonts/Haskoy-ExtraBold.otf", weight: "800", style: "normal" },
    { path: "../public/fonts/Haskoy-ExtraBoldItalic.otf", weight: "800", style: "italic" },
  ],
  variable: "--font-haskoy",
});

export const metadata: Metadata = {
  title: "Yardage",
  description: "A marketplace for students buying and selling pre-owned items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${haskoy.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
