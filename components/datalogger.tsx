"use client";

import { useEffect } from "react";

export default function DataLogger({ data }: { data: any }) {
  useEffect(() => {
    console.log("Fetched Data:", data);
  }, [data]);

  return null; // This component only logs data
}
