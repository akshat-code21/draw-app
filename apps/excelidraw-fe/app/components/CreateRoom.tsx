"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function CreateRoom({ token, userId }: { token: string, userId: string }) {
    const [roomName, setRoomName] = useState("");
    const router = useRouter();
    const handleCreateRoom = async () => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/create-room`, {
                name: roomName,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log(res);
            if (res.status === 200) {
                if (res.data.roomId) {
                    router.push(`/canvas/${Number(res.data.roomId)}`);
                } else {
                    toast.error("Room already exists");
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="flex gap-4 items-center justify-center h-screen">
            <Card className="w-[300px] flex flex-col gap-4">
                <CardHeader>
                    <CardTitle>Create Room</CardTitle>
                    <CardDescription>Create a new room to start drawing</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <Input type="text" placeholder="Room Name" className="w-full" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                        <Button className="w-full" onClick={handleCreateRoom}>Create & Join Room</Button>
                    </div>
                </CardContent>
            </Card >
        </div >
    )
}