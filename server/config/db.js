import mongoose from "mongoose";

const connectDb = async () => {
    try {
        console.log("Attempting DB connection...");

        const conn = await mongoose.connect(
            process.env.MONGO_URI,
            {
                serverSelectionTimeoutMS: 5000
            }
        );

        console.log(
            `DB connected: ${conn.connection.host}`
        );
    } catch (error) {
        console.error("Mongo Error:");
        console.error(error);
    }
};

export default connectDb;