import prisma from "@/prisma/db";
import { scryptSync } from "crypto";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        // Create scrypt hash of password
        const hashedPassword = scryptSync(
          credentials.password as string,
          "",
          64
        ).toString("hex");

        console.log(credentials);

        // logic to verify if the user exists
        user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
            password: hashedPassword,
          },
        });

        if (!user) {
          throw new Error("Invalid credentials.");
        }

        return user;
      },
    }),
  ],
});
