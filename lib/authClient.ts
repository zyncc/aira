import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const { useSession, signIn, signUp, signOut, admin } = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [adminClient()],
});
