import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const { useSession, signIn, signUp, signOut, admin } = createAuthClient({
  plugins: [adminClient()],
});
