"use client";
import { usePathname } from "next/navigation";
import Header from "./Header/Header";

export default function HeaderWrapper() {
  const pathname = usePathname();
  const hideHeader = ["/", "/oauth/google/callback"];
  const showHeader = !hideHeader.includes(pathname);

  return showHeader ? <Header /> : null;
}
