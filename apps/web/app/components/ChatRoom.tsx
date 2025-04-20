import axios from "axios"
import ChatRoomClient from "./ChatRoomClient";

async function getChats(roomId: string) {
    try {
        console.log(roomId);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/${Number(roomId)}`);
        return res.data.messages;
    } catch (error:any) {
        console.log(error.config);
    }
}
export default async function ChatRoom({ roomId }: {
    roomId: string
}) {
    const messages = await getChats(roomId);
    return <div><ChatRoomClient messages={messages} roomId={roomId}/></div>
}