import { Select } from "@radix-ui/react-select";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
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
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ProgrammingLanguage } from "@/utils/languages";
import { useContext } from "react";
import { Socket } from "socket.io-client";
import { SocketContext } from "@/context/socket-context";
import createRoomSchema, {
  CreateRoomSchemaType,
} from "@/hooks/create-room-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createRoom } from "@/services/room.service";

export default function CreateRoom() {
  const socket = useContext<Socket>(SocketContext);

  const form = useForm<CreateRoomSchemaType>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      language: "javascript",
      socketID: "",
    },
  });

  async function onSubmit(values: CreateRoomSchemaType) {
    const response = await createRoom({ ...values, socketID: socket.id || "" });

    if (response) {
      socket.emit("join", {
        roomID: response.roomID,
        name: values.owner,
        github: values.github,
      });
    }
  }

  return (
    <Drawer>
      <DrawerTrigger>
        <Button>Create Room</Button>
      </DrawerTrigger>
      <DrawerContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DrawerHeader>
              <DrawerTitle>Create your own room</DrawerTitle>
              <DrawerDescription>
                Invite collaborators to build great projects.
              </DrawerDescription>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Room name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a room creative room name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormDescription>What we call you?</FormDescription>
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
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(ProgrammingLanguage).map(
                            (language) => (
                              <SelectItem key={language} value={language}>
                                {language}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select your preffered language.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DrawerHeader>
            <DrawerFooter>
              <div className="flex items-center justify-end gap-2">
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
                <Button type="submit">Submit</Button>
              </div>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
