import {
  adminClient,
  emailOTPClient,
  inferAdditionalFields,
  oneTapClient,
  phoneNumberClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    phoneNumberClient(),
    inferAdditionalFields({
      user: {
        emailOffers: {
          type: "boolean",
        },
        storeCredit: {
          type: "number",
        },
      },
    }),
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      autoSelect: false,
      cancelOnTapOutside: false,
      context: "signin",
      promptOptions: {
        baseDelay: 15000,
        maxAttempts: 1,
      },
    }),
    emailOTPClient(),
  ],
});
