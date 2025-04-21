import axios from "axios";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    };
export default async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");
  let existingShapes: Shape[] = await getExistingShapes(roomId);
  if (!ctx) {
    return;
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShapes.push(parsedShape.shape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };
  clearCanvas(existingShapes, canvas, ctx);
  ctx.strokeRect(25, 25, 100, 100);
  let clicked = false;
  let startX = 0;
  let startY = 0;
  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });
  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width: width,
      height: height,
    };
    existingShapes.push(shape);
    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId: Number(roomId),
      })
    );
  });
  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      clearCanvas(existingShapes, canvas, ctx);
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 2;
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}
function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0)";
  existingShapes.map((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 2;
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}
async function getExistingShapes(roomId: string) {
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
