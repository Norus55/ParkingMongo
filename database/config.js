import { connect } from "mongoose";

export async function dbConnect() {
    try {
        await connect(process.env.MONGO_CNN)
        console.log('Connected to the database')
        
    } catch (error) {
        console.log(error);
        
    }
    
}

export default dbConnect