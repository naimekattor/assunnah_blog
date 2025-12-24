"use client";

import { useEffect } from "react";

export default function KeepAlive() {
  useEffect(() => {
    fetch("/api/keep-alive");
  }, []);

  return null; // renders nothing
}
