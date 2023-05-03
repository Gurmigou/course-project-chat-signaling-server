import {Server} from "socket.io";
import {RoomStorage} from "./roomStorage.js";

const io = new Server(3020);
const roomStorage = new RoomStorage();

io.on("connection", socket => {

    socket.on("joined_room", (userId, roomId) => {
        console.log("Server: User", userId, "joined room", roomId)

        roomStorage.addUserToRoomIfNotExists(userId, roomId, socket.id)
        console.log(roomStorage.map)
        notifyPeerIfPossible(roomId, userId, "joined_room")
    })

    socket.on("left_room", (userId, roomId) => {
        console.log("Server: User", userId, "left room", roomId)

        roomStorage.removeUserFromRoom(userId, roomId)
        notifyPeerIfPossible(roomId, userId, "left_room")
    })

    socket.on("msg_to_peer", (userId, roomId, communicationMsg) => {
        console.log("Server: Message to peer from ", userId, ", room id: ", roomId, ", message: ", communicationMsg)

        const peer = roomStorage.getPeerByRoomId(roomId, userId)
        if (peer) {
            console.log("SENT TO PEER")
            io.to(peer.socketId).emit("msg_to_peer", { from: userId, message: communicationMsg.message })
        }
    })
});


const notifyPeerIfPossible = (roomId, userId, event) => {
    const peer = roomStorage.getPeerByRoomId(roomId, userId)
    console.log("Server: Peer", peer)
    if (peer) {
        console.log("Server: Emitting", event, "to", peer.socketId)
        io.to(peer.socketId).emit(event.toString(), userId)
    }
}