import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signIn } from 'next-auth/react';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),

    CredentialsProvider({
      name:"Credentials",
      credentials:{
        email:{label:"Email",type:"email"},
        password:{label:'Password',type:"password"},
      },
      async authorize(credentials){
        await connectDB();

        const user = await User.findOne({email:credentials.email});
        if(!user) throw new Error("No user found with this email");

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if(!isPasswordValid) throw new Error("Invalid credentials");


        return {id:user._id, name:user.name, email:user.email};
      },
    }),
  ],

  pages: {
    error: '/Login',
    signIn:'/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, profile }) {
      await connectDB();
      let dbUser = await User.findOne({ email: user.email });

      if (dbUser) {
        if (dbUser.status === "disabled") {
          throw new Error("Your account has been disabled. Please contact Support.");
        }
      } else {
        dbUser = await User.create({
          email: profile.email,
          firstName: profile.given_name || "",
          lastName: profile.family_name || "",
          picture: profile.picture || "",
          status: "active",
          role: "user",
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        token.role = dbUser?.role || "user";
        token.status = dbUser?.status || "active";
      }
      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role;
      session.user.status = token.status;

      if (token.status === "disabled") {
        return null;
      }

      return session;
    },

    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
