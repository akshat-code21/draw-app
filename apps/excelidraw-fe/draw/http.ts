import axios from "axios";
export async function getExistingShapes(roomId: string) {
  if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    console.log("backend url missing");
    return;
  }
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/${Number(roomId)}`
  );
  const messages = res.data.messages;
  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });
  return shapes;
}
