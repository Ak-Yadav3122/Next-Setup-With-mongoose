import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

// define type of user schema by using interfacee keyword
export interface User {
  email: string;
  password: string;
  _id?: mongoose.Types.ObjectId; //defalt way to write _id in mongodb
  createdAt?: Date;
  updatedAt?: Date;
}

//define userSchema

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true } // for created-at and updated-at field
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models?.User || model<User>("User", userSchema);

export default User;

