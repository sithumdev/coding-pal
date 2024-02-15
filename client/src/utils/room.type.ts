interface Participant {
  _id: string;
  name: string;
  github: string;
  socketID: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  _id: string;
  roomID: string;
  name: string;
  language: string;
  owner: string;
  participants: Participant[];
  createdAt: string;
  updatedAt: string;
}
