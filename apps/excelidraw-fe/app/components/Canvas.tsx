"use client"
import { Game } from "@/draw/Game";
import { useEffect, useRef, useState } from "react";
type ShapeTypes = "rect" | "line" | "circle"
export default function Canvas({ roomId, socket }: {
    roomId: string,
    socket: WebSocket
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [shape, setShape] = useState<ShapeTypes>("rect");
    useEffect(() => {
        game?.setShape(shape)
    }, [shape, game])
    useEffect(() => {
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);
            return (() => {
                g.destroy();
            })
        }
    }, [canvasRef])
    return (
        <div style={{
            height: "100vh",
            overflow: "hidden"
        }}>
            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                style={{ border: "1px solid black", background: "#000000" }}
            ></canvas>
            <div className="text-white flex items-center justify-center gap-22 text-2xl absolute bottom-0 mx-auto right-0">
                <button className="rounded-sm border-2 border-gray-600 p-3 cursor-pointer" onClick={() => setShape("rect")}>Rectangle</button>
                <button className="rounded-sm border-2 border-gray-600 p-3 cursor-pointer" onClick={() => setShape("circle")}>Circle</button>
                <button className="rounded-sm border-2 border-gray-600 p-3 cursor-pointer" onClick={() => setShape("line")}>Line</button>
            </div>
        </div>
    )
}