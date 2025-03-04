import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./db";
import UserModel from "../models/User";

// NextAuth options object with credentials provider
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      // define the credentials that will be requested from the user
      credentials: {
        // username:{label:"Username",type:"test"},
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          await connectToDatabase(); //connect to the database

          // find the user with the email provided in the credentials
          const user = await UserModel.findOne({ email: credentials.email });

          // if  no user found with the email then throw an error
          if (!user) {
            throw new Error("No user found with this email");
          }

          //compare the password provider in the  credientials with the password strored in the database
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          //if password is invalid then throw an error
          if (!isValid) {
            throw new Error("Invalid password");
          }

          // if password is valid then return the user object
          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  // define the callbacks that will be called when jwt token is created and session is created
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // giving maxage for session is 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
