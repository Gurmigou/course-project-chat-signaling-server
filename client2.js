import { io } from "socket.io-client";

const socket = io("ws://localhost:3020");

socket.emit("joined_room", 2, 109);

socket.on("joined_room", (peer_id, room_id) => {
    console.log("Client2: User", peer_id, "joined room", room_id)
});
