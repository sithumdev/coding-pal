import { editor } from "monaco-editor";
import { useContext, useEffect, useRef, useState } from "react";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import * as Y from "yjs";
import { SocketContext } from "@/context/socket-context";
import { Socket } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getRoomDetails } from "@/services/room.service";
import { Room } from "@/utils/room.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const SOCKET_URL = import.meta.env.VITE_SERVER_WS_URL;

export default function Editor() {
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room>();
  const [content, setContent] = useState<string>();

  const socket = useContext<Socket>(SocketContext);

  const { roomID } = useParams();

  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
    editorRef.current = editor;

    // Initialize yjs
    const doc = new Y.Doc(); // collection of shared objects

    // Connect to peers with Web RTC
    const provider: WebsocketProvider = new WebsocketProvider(
      SOCKET_URL,
      roomID || "",
      doc
    );
    const type = doc.getText("monaco");

    // Bind yjs doc to Manaco editor
    const binding = new MonacoBinding(
      type,
      editorRef.current!.getModel()!,
      new Set([editorRef.current!])
    );
    console.log(binding, provider);
  }

  async function getRoomInfo(roomID: string) {
    const response = await getRoomDetails(roomID);

    if (
      Object.keys(response).includes("statusCode") &&
      response.statusCode === 404
    ) {
      toast("Room not found", {
        description: `Owner has cancelled the room.`,
      });
      navigate("/");
    } else {
      setRoom(response);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("palJoined", (_data) => {
      if (roomID) {
        getRoomInfo(roomID);
      }
    });

    socket.on("palLeft", (data) => {
      if (roomID) {
        if (data && data.socketID === socket.id) {
          navigate("");
        } else {
          getRoomInfo(roomID);
        }
      }
    });

    socket.on("palTyped", (data) => {
      if (data) {
        console.log("PAL Typed ", data);
        setContent(data.content);
      }
    });

    return () => {};
  }, []);

  useEffect(() => {
    if (roomID) {
      getRoomInfo(roomID);
    }
  }, [roomID]);

  async function leaveRoom() {
    socket.emit("leave", { roomID });
    navigate("/");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  function handleEditorChange(value: any, _event: any) {
    socket.emit("type", { roomID, content: value });
  }

  return (
    <section className="grid min-h-screen w-full grid-cols-12  p-1 lg:p-5">
      <div className="order-2 col-span-12 rounded-md border p-2 lg:order-1 lg:col-span-8">
        <MonacoEditor
          height="100%"
          language="javascript"
          defaultValue={"// your code here"}
          theme="vs-light"
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          value={content}
        />
      </div>
      <div className="col-span-12 p-5 lg:col-span-4">
        <Badge>{roomID}</Badge>
        <h2 className="mt-2 text-2xl">{room?.name}</h2>

        <div className=" mt-2 rounded-md border p-2 lg:mt-6">
          <p className="mb-2 text-sm">Participants</p>
          <div className="flex flex-wrap gap-1">
            {room &&
              room.participants.map((participant) => (
                <HoverCard key={participant._id}>
                  <HoverCardTrigger asChild>
                    <Avatar
                      className={
                        participant.socketID === socket.id
                          ? "border-2 border-blue-500"
                          : ""
                      }
                    >
                      <AvatarImage
                        src={`https://github.com/${participant.github}.png`}
                        alt="@shadcn"
                      />
                      <AvatarFallback>{participant.name}</AvatarFallback>
                    </Avatar>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex flex-col space-y-2">
                      <Avatar>
                        <AvatarImage
                          src={`https://github.com/${participant.github}.png`}
                          alt="@shadcn"
                        />
                        <AvatarFallback>{participant.name}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">
                          @{participant.github}
                        </h4>
                        <p className="text-lg">{participant.name}</p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            className="mt-5"
            variant="destructive"
            onClick={() => leaveRoom()}
          >
            Leave Room
          </Button>
        </div>
      </div>
    </section>
  );
}
