import mongoose from "mongoose"

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection
        connection.on('connected', () => {
            console.log("MONGODB Connected Successfully!!!.");
        })
        connection.on('error', (error) => {
            console.log("MONGODB Connection Error, Please make sure DB is up and running: " + error);
            process.exit();
        })
    } catch (error) {
        console.log("MONGODB Connection ERROR!!!.");
        console.log(error);
        
    }
}