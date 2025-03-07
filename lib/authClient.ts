import { createAuthClient } from "better-auth/react";
import { adminClient, oneTapClient } from "better-auth/client/plugins";
import { magicLinkClient } from "better-auth/client/plugins";

export const {
  useSession,
  getSession,
  signIn,
  signUp,
  signOut,
  admin,
  oneTap,
  magicLink,
} = createAuthClient({
  plugins: [
    adminClient(),
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    }),
    magicLinkClient(),
  ],
});
