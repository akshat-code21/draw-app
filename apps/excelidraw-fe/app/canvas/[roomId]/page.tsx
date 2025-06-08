import RoomCanvas from "@/app/components/RoomCanvas";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
export default async function CanvasPage({ params }: {
    params: {
        roomId: string
    }
}) {
    const roomId = (await params).roomId
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return <RoomCanvas roomId={roomId} token={session?.session.token || ""} />
}