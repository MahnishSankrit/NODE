import "dotenv/config";
import mongoose from "mongoose";
export const DB_NAME = "mahinsh";


const connectDb = async () => {
    try {
        const connectingDB = await mongoose.connect(process.env.MONGOOSE_URI); // ✅ FIXED

        console.log(`✅ MongoDB connected successfully at: ${connectingDB.connection.host}/${DB_NAME}`);
        console.log(`State: ${connectingDB.connection.readyState}`);
        
    } catch (error) {
        console.log("❌ Database connection failed", error.message);
        process.exit(1);
    }
};

export default connectDb;


