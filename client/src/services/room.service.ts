import { CreateRoomSchemaType } from "@/hooks/create-room-schema";

const API_URL = import.meta.env.VITE_SERVER_URL;

export async function createRoom(room: CreateRoomSchemaType) {
  return fetch(`${API_URL}/room`, {
    method: "POST",
    body: JSON.stringify(room),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

export async function getRoomDetails(roomID: string) {
  try {
    const response = fetch(`${API_URL}/room/${roomID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.then((res) => res.json());
  } catch (e) {
    throw new Error("Room is not found");
  }
}
