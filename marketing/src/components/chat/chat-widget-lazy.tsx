"use client";

import dynamic from "next/dynamic";
import { siteConfig } from "@/lib/utils";

const ChatWidget = dynamic(
  () => import("./chat-widget").then((mod) => mod.ChatWidget),
  { ssr: false, loading: () => null },
);

export function ChatWidgetLazy() {
  const enabled = Boolean(siteConfig.orgSlug);
  return <ChatWidget enabled={enabled} />;
}
