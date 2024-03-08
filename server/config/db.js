import mongoose from 'mongoose';

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.Mongo_Uri);
        console.log(`MongoDB connected ${conn.connections[0].host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`.red.bold);
        process.exit(1); // Exit with a non-zero status code to indicate an error
    }

}

export default connectDB;