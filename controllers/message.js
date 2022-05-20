import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { Chat } from "../models/chat.js";
const sendMessage = async(req,res)=>{
   const {content, chat} = await req.body; 
   if(!content || !chat)
   return res.status(400).json({error:"Invalid Request"}); 
   var newMessage =  {
       sender:req.user._id,
       content:content,
       chat:chat,
   }; 

   try {
      var message = await new Message(newMessage).save(); 
      message = await message.populate("sender", "name pic"); 
      message = await message.populate("chat"); 
      message = await User.populate(message, {
          path:"chat.users",
          select:"name pic email"
      }); 

      await Chat.findByIdAndUpdate(chat, {latestMessage:message}); 
     return res.status(200).json(message); 
   } catch (error) {
       console.log(error)
      return res.status(500).json({error:"Internal server error"})
   }
}; 

const allMessages = async(req,res)=>{
    try {
        const messages = await Message.find({chat:req.params.chatId})
        .populate("sender", "name pic email")
        .populate("chat"); 
        if(!messages)
            return res.status(400).json({error:"Error in fetching the message"})
           return res.status(200).json(messages); 
    } catch (error) {
       console.log(error); 
       return res.status(500).json({error:"Internal servor error"}); 
    }
}

export {sendMessage, allMessages}