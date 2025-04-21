"use client"
import { useEffect, useState } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({ roomId }: {
    roomId: string
}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(() => {
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMGQ3ZmZiNS1hNjdhLTQ4ZjQtYTI2NC1iNjVkYjVkOTcyYjEiLCJpYXQiOjE3NDUxOTY2OTR9.JHjp5hiHHrHYqHkBgTEVa4hUnFa2NmNo3g-U3fUsebY`);
        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId: Number(roomId)
            }))
        }
    }, [])
    if (!socket) {
        return <div>Connecting to server....</div>
    }
    return <div>
        <Canvas roomId={roomId} socket={socket}/>
    </div>
}