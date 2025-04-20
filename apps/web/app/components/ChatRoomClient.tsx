"use client"

import { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket"
export default function ChatRoomClient({
    messages, roomId
}: {
    messages: { message: string }[],
    roomId: string
}) {
    const [chats, setChats] = useState(messages);
    const [currMessage, setCurrentMessage] = useState<string>();
    const { socket, loading } = useSocket();
    useEffect(() => {
        console.log(socket);
        if (socket && !loading) {
            socket.send(JSON.stringify({
                type: "join_room",
                roomId: roomId
            }));
            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if (parsedData.type === "chat") {
                    setChats(c => [...c, { message: parsedData.message }])
                }
            }
        }
    }, [socket, loading, roomId])
    return <div>
        {chats && chats.map((m,idx) => {
            return (
                <div key={idx}>{m.message}</div>
            )
        })}
        <input type="text" value={currMessage} onChange={(e) => setCurrentMessage(e.target.value)} />
        <button onClick={() => {
            socket?.send(JSON.stringify({
                type: "chat",
                roomId: roomId,
                message: currMessage
            }))
            setCurrentMessage("")
        }}>Send</button>
    </div>
}