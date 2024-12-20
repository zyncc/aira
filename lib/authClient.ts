import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const { useSession, signIn, signUp, signOut } = createAuthClient({
  baseURL:
    process.env.NODE_ENV == "development"
      ? "http://localhost:3000"
      : "https://airaa.vercel.app/",
  plugins: [adminClient()],
});
