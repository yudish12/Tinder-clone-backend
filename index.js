import express from 'express';
import cors from 'cors'
import morgan from 'morgan';
import http from 'http';
import 'dotenv/config'
import mongoose from 'mongoose';
import { errHandler } from './middlewares/errorMiddleware.js';
import { AppError } from './utils/AppError.js';
import authRoutes from './routes/authRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import filterRoutes from './routes/filterRoutes.js'
import matchReqRoutes from './routes/matchReqRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { Server } from 'socket.io';
import { messageService } from './services/messageService.js';
import { sub } from './services/redisService.js';

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"]
	}
})


io.on("connection", (socket) => {
	console.log("someone connected")

	socket.on("disconnect", () => console.log("someone disconnected"))

	socket.use((socket, next) => {
		next();
	})

	const service = new messageService(socket);

	service.listen('joinroom')
	service.listen('messagesent')

	sub.on('message', async (channel, message) => {
		console.log(channel,message)
		switch (channel) {
			case 'ROOM-JOIN':
				service.joinRoom(message)
				break;

			case 'MESSAGE':
				console.log(52)
				const params = JSON.parse(message);
				service.emitEvent(params)
				break;

			default:
				break;
		}
	})
});





app.use(express.json())

const dbString = process.env.MONGO_URI;
mongoose
	.connect(dbString, {
		useNewUrlParser: true,
	})
	.then((con) => {
		// console.log(con.connections);
		console.log('DB connection completed');
	})
	.catch((e) => console.log(e));

var corsOptions = {
	origin: 'http://localhost:5173',
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use(morgan('dev'))

app.get("/", (req, res) => {
	res.send("Hello")
})

app.use("/api/auth", authRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/filter", filterRoutes);
app.use('/api/messages', messageRoutes)
app.use("/api/match/req", matchReqRoutes);

app.all('*', (req, res, next) => {
	//AppError class for error handler object
	next(new AppError(`Cannot find route ${req.originalUrl} in the server`, 404));
});

app.use(errHandler)

server.listen(5000, () => {
	console.log("Server Started")
})

