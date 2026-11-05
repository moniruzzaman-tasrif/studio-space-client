import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins"
const client = new MongoClient(process.env.MONGODB_URL as string);
export const db = client.db("StudioSpace");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ? process.env.BETTER_AUTH_URL.replace(/\/+$/, "") : undefined,
  secret: process.env.BETTER_AUTH_SECRET,
    plugins: [
        jwt(),
    ],

    session:{
      cookieCache:{
strategy:"jwt",
enabled:true,
maxAge:7*24*60*60
      }
    },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
});
