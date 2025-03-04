import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

// define type of user schema by using interface  keyword
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

// adding pre hook to hash password before saving to database using bcrypt 

userSchema.pre("save", async function (next) {

  // if password is not modified then skip this hook and if password is modified then hash the password

  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();

});

//if user model already exists then use it otherwise create the new model using userSchema

const User = models?.User || model<User>("User", userSchema);

export default User;

/* 
NOTES ;
Model:- use to cretae the model of the schema

Models:- An array containing all models associated with this Mongoose instance.

*/