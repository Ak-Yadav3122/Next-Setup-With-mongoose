import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

// handle POST request
export async function POST(request: NextRequest) {
  try {
    //get email and password from the request body
    const { fullname, email, password } = await request.json();

    if (!fullname) {
      return NextResponse.json({ error: "Fullname is required" });
    }
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and Password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase(); //connect to the database

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // If user does not exist ,create the new user
    await User.create({
      fullname,
      email,
      password,
    });

    // return the response
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
