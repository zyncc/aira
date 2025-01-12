import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const { useSession, signIn, signUp, signOut, admin } = createAuthClient({
  baseURL: "https://pansy.in",
  plugins: [adminClient()],
});
