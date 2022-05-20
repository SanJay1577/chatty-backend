import express from "express"; 
import cors from "cors"; 
import dotenv from "dotenv"; 
import {mongoConnection} from "./db.js"
import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/user.js";
import { chatRouter } from "./routes/chat.js";
import { messageRouter } from "./routes/message.js";
import {Server} from "socket.io"; 

//environmnet configuration 
dotenv.config();

//DataBase connection 
mongoConnection(); 

//initializing the server 
const app = express(); 
const PORT = process.env.PORT; 


//middlewares
app.use(express.json()); 
app.use(cors()); 

//Routes
app.use("/api", authRouter); 
app.use("/api", userRouter); 
app.use("/api", chatRouter); 
app.use("/api", messageRouter); 


app.get("/", (req,res)=>{
    res.status(200).send("This is chatty app api")
})

const io = new Server(app.listen(PORT, ()=>console.log(`Server hosted in localhost:${PORT}`)), {
    pingTimeout:60000,
    cors:{
        orgin: "http://localhost:3000"
    },
})

io.on("connection", (socket)=>{
    console.log("Connected to socket.io"); 
    socket.on("setup", (userData)=>{
        socket.join(userData._id); 
        socket.emit("connected"); 
    }); 

    socket.on("join chat", (room)=>{
        socket.join(room); 
        console.log("join room" + room )
    }); 

    socket.on("typing", (room)=>socket.in(room).emit("typing")); 
    socket.on("stop typing", (room)=>socket.in(room).emit("stop typing")); 

    socket.on("new message", (newMessageRecieved)=>{
        var chat = newMessageRecieved.chat; 
        if(!chat.users) return console.log("chat.users not defined"); 

        chat.users.forEach((user)=>{
            if(user._id == newMessageRecieved.sender._id) return; 
            socket.in(user._id).emit("message recieved", newMessageRecieved)
        }); 
    }); 

    socket.off("setup", ()=>{
        console.log("USER disconnected"); 
        socket.leave(userData._id)
    })
}); 

