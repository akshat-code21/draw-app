import { useEffect, useState } from "react";

export default function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();
  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMGQ3ZmZiNS1hNjdhLTQ4ZjQtYTI2NC1iNjVkYjVkOTcyYjEiLCJpYXQiOjE3NDUxMzg0ODN9.GaZr1xuAEt1pc3E041g7m_ntTj8tNuAWq8mPF6G0k1g`);
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);
  return { loading, socket };
}
