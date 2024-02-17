import { pub, sub } from "./redisService.js";
let i = 0;
export class messageService {

    constructor(socket) {
        this.socket = socket;
        //init redis subsriber
        sub.subscribe('ROOM-JOIN')
        sub.subscribe('MESSAGE');
    }

    listen(eventName) {
        this.socket.on(eventName, async (params) => {
            switch (eventName) {
                case 'joinroom':

                    const isauth = params.users.find((e) => e.email === this.socket.handshake.auth.email);
                    if (isauth) {
                        //publish to redis pub-sub
                        await pub.publish("ROOM-JOIN", params._id)
                        // this.socket.join(params._id)

                    }
                    break;
                case 'messagesent':
                    pub.publish("MESSAGE", JSON.stringify(params));
                // this.socket.to(params._id).emit('message',{
                //     message:params.message,
                // });
                default:
                    break;
            }
        })
    }

    joinRoom(roomid) {
        this.socket.join(roomid);
    }

    emitEvent(params) {
        console.log(params,41)
        this.socket.to(params._id).emit('message',{
            message:params.message,
        });
    }

}
