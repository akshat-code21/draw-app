import axios from "axios";
import ChatRoom from "../../components/ChatRoom";
async function getRoomId(slug: string) {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/${slug}`)
    return res.data.roomId;
}
export default async function ChatRoomPage({ params }: {
    params: {
        slug: string
    }
}) {
    const slug = (await params).slug;
    const roomId = await getRoomId(slug);
    return <ChatRoom roomId={roomId} />
}