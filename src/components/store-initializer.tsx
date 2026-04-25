"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export function StoreInitializer() {
  const initializeStore = useStore((s) => s.initializeStore);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return null;
}
