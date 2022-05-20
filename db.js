import mongoose from 'mongoose'; 

export function mongoConnection (){
    const params = {
        useNewUrlParser: true,
        useUnifiedTopology:true,
    }
    try{
        mongoose.connect(process.env.MONGO_URL, params)
        console.log("Mongo database Connected")
    } catch(error){
        console.log(error)
    }
}