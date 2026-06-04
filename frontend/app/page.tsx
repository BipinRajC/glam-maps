"use client";

import dynamic from "next/dynamic";

const GlamMaps = dynamic(() => import("@/components/GlamMaps"), { ssr: false });

export default function Home() {
  return <GlamMaps />;
}
