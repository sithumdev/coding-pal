import WelcomeSvg from "../assets/welcome.svg";
import { useContext, useEffect } from "react";
import { SocketContext } from "@/context/socket-context";
import { Socket } from "socket.io-client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import CreateRoom from "@/components/create-room";
import JoinRoom from "@/components/join-room";

export default function Home() {
  const navigate = useNavigate();

  const socket = useContext<Socket>(SocketContext);

  useEffect(() => {
    socket.on("palJoined", (data) => {
      if (data.socketID === socket.id) {
        toast("Successfully created a room");
        navigate(`/editor/${data.roomID}`);
      }
    });

    return () => {};
  }, []);

  return (
    <>
      <section className="flex min-h-screen w-full items-center gap-6 p-10">
        <div className="flex flex-1 flex-col justify-center">
          <h1 className="text-4xl">
            Welcome to{" "}
            <span className="text-italic" translate="no">
              Coding PAL
            </span>
          </h1>
          <p className="mt-2 text-xs">
            We're thrilled to welcome you to Coding PAL, the ultimate
            destination where creativity, collaboration, and coding excellence
            converge. Get ready to embark on a journey where your coding
            projects come to life through the power of teamwork!
          </p>
          <div className="mt-6 flex items-center gap-3">
            <CreateRoom />
            <JoinRoom />
          </div>
        </div>
        <div className="jusitfy-center flex flex-1 items-center">
          <img alt="Welcome" src={WelcomeSvg} className="h-[400px] w-auto" />
        </div>
      </section>
    </>
  );
}
