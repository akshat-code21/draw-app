import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import axios from "axios"
import CreateRoom from "../components/CreateRoom";

export default async function Dashboard() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    let rooms = null;
    if (session?.session.token) {
        try {
            const roomsResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/get-rooms`, {
                headers: {
                    Authorization: `Bearer ${session.session.token}`,
                },
            });
            rooms = roomsResponse.data.rooms;
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
        }
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {session?.user?.name || session?.user?.email}</p>
            {rooms && (
                <div>
                    <h2>Your Rooms:</h2>
                    <ul>
                        {rooms.map((room: any) => (
                            <li key={room.id}>
                                <a href={`/canvas/${room.id}`}>{room.slug} {room.id}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <CreateRoom token={session?.session.token || ""} userId={session?.user.id || ""} />
        </div>
    )
}