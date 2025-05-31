import { serve } from "inngest/next";
import { inngest, syncUserData, updateUserData, deleteUserData } from "@/config/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserData,
    updateUserData,
    deleteUserData,
  ],
});
