import { createAuthClient } from "better-auth/react";
import { adminClient, oneTapClient } from "better-auth/client/plugins";
import { emailOTPClient } from "better-auth/client/plugins";
import { phoneNumberClient } from "better-auth/client/plugins";

export const {
  useSession,
  getSession,
  signIn,
  signUp,
  signOut,
  admin,
  oneTap,
  emailOtp,
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
      context: "signin",
      promptOptions: {
        baseDelay: 3000,
        maxAttempts: 5,
      },
    }),
    emailOTPClient(),
  ],
});
