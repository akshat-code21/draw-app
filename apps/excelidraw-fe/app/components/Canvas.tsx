"use client"
import { Game } from "@/draw/Game";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
type ShapeTypes = "rect" | "line" | "circle"

export default function Canvas({ roomId, socket }: {
    roomId: string,
    socket: WebSocket
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [shape, setShape] = useState<ShapeTypes>("rect");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [toolBarOpen, setToolBarOpen] = useState(false);
    const router = useRouter();
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

    const tools = [
        { type: "rect", label: "Rectangle", icon: "⬜" },
        { type: "circle", label: "Circle", icon: "⭕" },
        { type: "line", label: "Line", icon: "📏" },
    ] as const;

    const handleDeleteAllShapes = () => {
        setIsModalOpen(false);
        game?.deleteAllShapes();
    }

    const handleExitRoom = () => {
        setIsExitModalOpen(false);
        game?.exitRoom();
        router.push("/dashboard");
    }

    return (
        <div className="relative h-screen w-full bg-gray-900 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 z-10 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700">
                <div className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">✏️</span>
                        </div>
                        <h1 className="text-white font-semibold text-lg">ExceliDraw</h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Button variant={"destructive"} onClick={() => setIsExitModalOpen(true)}>
                            Exit Room
                        </Button>
                        <Button variant={"destructive"} onClick={() => setIsModalOpen(true)}>
                            Delete All Shapes
                        </Button>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Room: {roomId}</span>
                    </div>
                </div>
            </div>

            <canvas
                ref={canvasRef}
                width={typeof window !== 'undefined' ? window.innerWidth : 1920}
                height={typeof window !== 'undefined' ? window.innerHeight : 1080}
                className="absolute top-0 left-0 bg-white"
                style={{
                    background: "radial-gradient(circle at 20px 20px, #e5e5e5 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                    width: '100vw',
                    height: '100vh'
                }}
            />

            <div className={cn("absolute left-6 top-1/2 -translate-y-1/2 z-10", toolBarOpen ? "w-20" : "w-20")}>
                <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 p-2">
                    <div className="flex flex-col gap-2">
                        <Button variant={"outline"} onClick={() => setToolBarOpen(!toolBarOpen)} className="w-16 h-10">
                            {toolBarOpen ? <ChevronUp strokeWidth={3} className="stroke-black w-6 h-6" /> : <ChevronDown strokeWidth={3} className="stroke-black w-6 h-6" />}
                        </Button>
                        {toolBarOpen && (
                            tools.map((tool) => (
                                <button
                                    key={tool.type}
                                    onClick={() => setShape(tool.type)}
                                    className={cn(
                                        "flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-all duration-200 group relative",
                                        "hover:scale-105 hover:shadow-lg",
                                        shape === tool.type
                                            ? "bg-blue-500 text-white shadow-lg scale-105"
                                            : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                                    )}
                                    title={tool.label}
                                >
                                    <span className="text-xl mb-1">{tool.icon}</span>
                                    <span className="text-xs font-medium">{tool.label}</span>

                                    {/* Tooltip */}
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                        {tool.label}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700">
                <div className="flex items-center justify-between px-6 py-2 text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                        <span>Tool: {tools.find(t => t.type === shape)?.label}</span>
                        <span>•</span>
                        <span>Click and drag to draw</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs">Connected</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-20 right-6 z-10">
                <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-xl border border-gray-200 p-2">
                    <div className="flex gap-2">
                        {tools.map((tool) => (
                            <button
                                key={`quick-${tool.type}`}
                                onClick={() => setShape(tool.type)}
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
                                    "hover:scale-110",
                                    shape === tool.type
                                        ? "bg-blue-500 text-white shadow-lg"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                )}
                                title={tool.label}
                            >
                                <span className="text-lg">{tool.icon}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {
                isModalOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
                        <div className="text-primary bg-white p-8 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">Delete All Shapes</h2>
                            <p className="mb-4">Are you sure you want to delete all shapes?</p>
                            <div className="flex justify-end gap-2">
                                <Button variant={"outline"} onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button variant={"destructive"} onClick={handleDeleteAllShapes}>Delete</Button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                isExitModalOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
                        <div className="text-primary bg-white p-8 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">Exit Room</h2>
                            <p className="mb-4">Are you sure you want to exit the room?</p>
                            <div className="flex justify-end gap-2">
                                <Button variant={"outline"} onClick={() => setIsExitModalOpen(false)}>Cancel</Button>
                                <Button variant={"destructive"} onClick={handleExitRoom}>Exit</Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}