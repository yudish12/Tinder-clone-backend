export class messageService {
    
    constructor(socket){
        this.socket = socket;
        
    }

    listen(eventName){
        this.socket.on(eventName,async(params)=>{
            switch (eventName) {
                case 'joinroom':
                    const isauth = params.users.find((e)=>e.email===this.socket.handshake.auth.email);
                    if(isauth) this.socket.join(params._id)
                    break;
                case 'messagesent':
                    this.socket.to(params._id).emit('message',{
                        message:params.message,
                    });
                default:
                    break;
            }
        })
    }

}