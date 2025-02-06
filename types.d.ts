//define the mongoose type globally
import { Connection } from "mongoose";

declare global {
  var mongoose: { //must use the var as a variable 
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

export {}