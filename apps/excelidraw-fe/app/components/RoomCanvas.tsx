"use client"
import { useEffect, useState } from "react";
import Canvas from "./Canvas";

export default function RoomCanvas({ roomId, token }: {
    roomId: string,
    token: string
}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    
    useEffect(() => {
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token as string}`);
        
        ws.onopen = () => {
            console.log("WebSocket connected");
            setSocket(ws);
            setTimeout(() => {
                setIsConnecting(false);
            }, 600);
        }
        
        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            setConnectionError("Failed to connect to server");
            setIsConnecting(false);
        }
        
        ws.onclose = () => {
            console.log("WebSocket closed");
            if (!connectionError) {
                setConnectionError("Connection lost");
                setIsConnecting(false);
            }
        }
        
        return () => {
            ws.close();
        }
    }, [token, connectionError])
    
    if (connectionError) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-center">
                    <div className="text-red-400 text-2xl mb-4">⚠️ Connection Error</div>
                    <div className="text-white text-lg mb-6">{connectionError}</div>
                    <button 
                        onClick={() => {
                            setConnectionError(null);
                            setIsConnecting(true);
                        }}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }
    
    if (isConnecting || !socket) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <div className="text-white text-2xl mb-2">Connecting to ExceliDraw</div>
                    <div className="text-gray-400 text-lg">Setting up real-time collaboration...</div>
                    <div className="text-gray-500 text-sm mt-4">Room: {roomId}</div>
                </div>
            </div>
        );
    }
    
    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}