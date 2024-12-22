import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO);
    }
    catch(err){
        console.log(err);
        return process.exit(1);
    }
}