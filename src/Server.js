import {Server} from "socket.io";
import {RoomStorage} from "./RoomStorage.js";

const io = new Server(3020);
const roomStorage = new RoomStorage();

io.on("connection", socket => {

    socket.on("joined_room", (username, roomId) => {
        console.log("Connected user:", username, ", room id:", roomId)
        roomStorage.addUserToRoomIfNotExists(username, roomId, socket.id)
        notifyPeerIfPossible(roomId, username, "joined_room")
    })

    socket.on("left_room", (username, roomId) => {
        console.log("Disconnected user:", username, ", room id:", roomId)
        roomStorage.removeUserFromRoom(username, roomId)
        notifyPeerIfPossible(roomId, username, "left_room")
    })

    socket.on("msg_to_peer", (username, roomId, communicationMsg) => {
        console.log("Msg to peer from", username, ", room id:", roomId, ", message:", communicationMsg.message);
        sendMessageToPeerIfPossible(roomId, username, communicationMsg.message, "msg_to_peer")
    })

    socket.on("chat_to_peer", (username, roomId, message) => {
        console.log("Chat message to peer from", username, ", room id:", roomId, ", message:", message);
        sendMessageToPeerIfPossible(roomId, username, message, "chat_to_peer");
    });

    socket.on("camera_toggle", (username, roomId, camera_state) => {
        console.log("Camera toggle from", username, ", room id:", roomId, ", camera state:", camera_state);
        notifyPeerCameraMicroIfPossible(roomId, username, "camera_toggle", camera_state)
    });

    socket.on("micro_toggle", (username, roomId, micro_state) => {
        console.log("Microphone toggle from", username, ", room id:", roomId, ", microphone state:", micro_state);
        notifyPeerCameraMicroIfPossible(roomId, username, "micro_toggle", micro_state)
    });
});


const notifyPeerIfPossible = (roomId, username, event) => {
    const peer = roomStorage.getPeerByRoomId(roomId, username)
    if (peer) {
        io.to(peer.socketId).emit(event.toString(), username)
    }
}

const notifyPeerCameraMicroIfPossible = (roomId, username, event, state) => {
    const peer = roomStorage.getPeerByRoomId(roomId, username)
    if (peer) {
        io.to(peer.socketId).emit(event.toString(), state)
    }
}

const sendMessageToPeerIfPossible = (roomId, username, message, event) => {
    const peer = roomStorage.getPeerByRoomId(roomId, username);
    if (peer) {
        io.to(peer.socketId).emit(event, {
            from: username,
            message: message,
        });
    }
}