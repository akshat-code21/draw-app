"use client"
import { useEffect, useState } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({ roomId, token }: {
    roomId: string,
    token: string
}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(() => {
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token as string}`);
        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId: Number(roomId)
            }))
        }
    }, [])
    if (!socket) {
        return <div className="text-white text-2xl flex items-center justify-center h-screen">Connecting to server....</div>
    }
    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}