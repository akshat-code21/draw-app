"use client"
import { useRouter } from "next/navigation";
import styles from "./page.module.css"
import { useState } from "react";
export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: 'center',
      height: "100vh",
      width: "100vw"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap : 7
      }}>
        <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Room Id" style={{
          padding : 8
        }} />
        <button onClick={() => {
          router.push(`/room/${roomId}`)
        }} style={{
          padding : 8,
          cursor : "pointer"
        }}>Join Room</button>
      </div>
    </div>
  );
}
