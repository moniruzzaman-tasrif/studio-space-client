import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins"
export const authClient = createAuthClient({
    plugins: [
    jwtClient()
  ],
  // No baseURL needed — the auth API is on the same domain (/api/auth/[...all])
});

export const { signIn, signUp, signOut, useSession } = authClient;
