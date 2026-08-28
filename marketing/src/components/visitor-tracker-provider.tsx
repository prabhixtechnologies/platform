"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getVisitorTracker } from "@/lib/visitor/tracker";

export function VisitorTrackerProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    getVisitorTracker().init();
  }, []);

  useEffect(() => {
    const search = searchParams.toString();
    getVisitorTracker().onRouteChange(pathname, search ? `?${search}` : "");
  }, [pathname, searchParams]);

  return null;
}
