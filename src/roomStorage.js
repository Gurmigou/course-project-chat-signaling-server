export const RoomStorage = class {
    constructor() {
        this.map = new Map();
    }

    addUserToRoomIfNotExists(username, roomId, socketId) {
        let usersInRoom = this.map.get(roomId);
        let userToAdd = {username: username, socketId};
        if (!usersInRoom) {
            this.map.set(roomId, [userToAdd]);
        } else if (!usersInRoom.find(u => u.username === username)) {
            usersInRoom.push(userToAdd);
        }
    }

    getPeerByRoomId(roomId, currentUserId) {
        let usersInRoom = this.map.get(roomId) || [];
        for (const user of usersInRoom) {
            if (user.username !== currentUserId) {
                return user;
            }
        }
        return null;
    }

    removeUserFromRoom(userId, roomId) {
        let usersInRoom = this.map.get(roomId) || [];
        let index = usersInRoom.findIndex(user => user.username === userId);
        if (index > -1) {
            usersInRoom.splice(index, 1);
        }
    }
}