import { authOptions } from "@/lib/nextAuthOptions"; // Import your custom NextAuth configuration
import NextAuth from "next-auth"; // Import NextAuth

// Create the NextAuth handler using your custom configuration
const handler = NextAuth(authOptions);

// Export the handler as both GET and POST to handle authentication requests
export { handler as GET, handler as POST };
