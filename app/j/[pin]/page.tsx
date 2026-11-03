"use client";
import { use } from "react";
import { PlayerApp } from "@/components/player";

export default function PlayerPage({ params }: { params: Promise<{ pin: string }> }) {
  const { pin } = use(params);
  return <PlayerApp pin={pin.replace(/\D/g, "")} />;
}
