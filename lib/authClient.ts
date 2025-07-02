import { createAuthClient } from "better-auth/react";
import { adminClient, oneTapClient } from "better-auth/client/plugins";
import { magicLinkClient } from "better-auth/client/plugins";
import { phoneNumberClient } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";

export const {
  useSession,
  getSession,
  signIn,
  signUp,
  signOut,
  admin,
  oneTap,
  magicLink,
  phoneNumber,
  sendVerificationEmail,
} = createAuthClient({
  plugins: [
    adminClient(),
    phoneNumberClient(),
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      autoSelect: false,
      cancelOnTapOutside: false,
      uxMode: "redirect",
      context: "signin",
      promptOptions: {
        baseDelay: 3000,
        maxAttempts: 5,
      },
    }),
    magicLinkClient(),
    nextCookies(),
  ],
});
