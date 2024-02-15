import { useContext } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Socket } from "socket.io-client";
import { SocketContext } from "@/context/socket-context";
import joinRoomSchema, { JoinRoomSchemaType } from "@/hooks/join-room-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export default function JoinRoom() {
  const socket = useContext<Socket>(SocketContext);

  const form = useForm<JoinRoomSchemaType>({
    resolver: zodResolver(joinRoomSchema),
  });

  async function onSubmit(values: JoinRoomSchemaType) {
    socket.emit("join", {
      roomID: values.roomID,
      name: values.name,
      github: values.github,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Join Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Join Room</DialogTitle>
              <DialogDescription>
                You can join to an existing room by filling the required
                information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormDescription>What should we call you?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Github</FormLabel>
                    <FormControl>
                      <Input placeholder="Github Username" {...field} />
                    </FormControl>
                    <FormDescription>Your github username.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roomID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Room ID" {...field} />
                    </FormControl>
                    <FormDescription>Paste the invited room ID</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Join</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
