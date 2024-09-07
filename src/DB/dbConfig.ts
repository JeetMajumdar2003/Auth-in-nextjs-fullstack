import mongoose from "mongoose";

let isConnected = false; // Track the connection status

export async function connect() {
    if (isConnected) {
        console.log("MONGODB is already connected.");
        return;
    }

    try {
        const connection = await mongoose.connect(process.env.MONGO_URI!);

        isConnected = !!connection.connections[0].readyState; // Connection status

        if (isConnected) {
            console.log("MONGODB Connected Successfully!!!.");
        }
    } catch (error) {
        console.log("MONGODB Connection Error, Please make sure DB is up and running: " + error);
        process.exit(1); // Exit the process if MongoDB connection fails
    }

    mongoose.connection.on('error', (error) => {
        console.error("MONGODB Connection Error: ", error);
    });
}


/** Hitesh Sir's Code(some issue on connecting to Docker MongoDB)
 * 
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
 */