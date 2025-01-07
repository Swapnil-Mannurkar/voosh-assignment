import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGO_URI as string;
    await mongoose.connect(uri, {
      dbName: "music",
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectMongoDB;
