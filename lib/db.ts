import { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

// check we have the mongodb url
if (!MONGODB_URI) {
  throw new Error("Please define the valid or correct MONGODB_URI");
}

// to check our global space in the node their have a mongodb connection or not but we know that global space have a big empty space objects.So we have to define the mongoose type that is present in types.d.ts file we have to manually create it.aur next es chij ko identify karega ki kis chij se type uthana hai.because that is defined in types.d.ts file.

let cached = global.mongoose;

//we dont have mongoose connection so we need a connection
if (!cached) {
  //if no cached
  cached = global.mongoose = {
    //make the cached and define their data
    conn: null,
    promise: null,
  };
}
//connect with database

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10, //define how many connection with the mongoDB at a same time
    };
    cached.promise = mongoose.connect(MONGODB_URI,opts).then (()=>mongoose.coonection);
  }
}
