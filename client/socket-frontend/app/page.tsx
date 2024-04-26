"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import io from "socket.io-client";

interface Message {
  id: string;
  message: string;
}

const socket = io("http://localhost:3001");
export default function Home() {
  const [sendedMessage, setSendedMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState<Message[]>([]);
  const [initialUserId, setInitialUserId] = useState<string | null>(null);


  useEffect(() => {
    socket.on("receive-message", (data) => {
      setReceivedMessage((prevMessages) => [...prevMessages, data]);
      if(initialUserId === null) setInitialUserId(data.id);
    });
  
    // Clean up the effect
    return () => {
      socket.off("receive-message");
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  const handleChange = (eo: React.ChangeEvent<HTMLInputElement>) => {
    setSendedMessage(eo.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sendedMessage.trim() === "") return;
    socket.emit("send-message", sendedMessage);
    setSendedMessage("");
  };
  return (
    <main className="w-full min-h-[100vh] relative">
      <div>
        <h1 className="text-center text-2xl py-5 w-full  gradient-bg-black">Chat Room</h1>
      </div>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="fixed bottom-0 left-0 right-0 w-full flex"
      >
        <input
          placeholder="Type your message here..."
          value={sendedMessage}
          onChange={(eo) => handleChange(eo)}
          type="text"
          className="flex-1 px-3 py-4 rounded-l-md text-black outline-none"
        />
        <button type="submit" className="px-10 rounded-r-md py-4 bg-red-500 gradient-bg">
          Send
        </button>
      </form>
      <ul className="m-5 flex flex-col gap-2 pb-[100px]">
        {receivedMessage.map((user, index) => (
          <li key={index} className="flex">
            <div className="flex items-center gap-2">
              <div className="w-[40px] h-[40px] rounded-full">
                <Image
                  src="https://res.cloudinary.com/dqhdokahr/image/upload/v1708426944/no_avatar_1_tjgnin.png"
                  alt="anonymous"
                  width={1000}
                  height={1000}
                  className="rounded-full w-full h-full"
                />
              </div>
              <div>
                <h1 className="text-[#777] text-[13px]">anonymous_{user.id}</h1>
                <h1>{user.message}</h1>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
