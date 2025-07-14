import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected',() => {
        console.log("DB Connected");
    })

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    await mongoose.connect(`${mongoUri}/thetee`)

}

export default connectDB;