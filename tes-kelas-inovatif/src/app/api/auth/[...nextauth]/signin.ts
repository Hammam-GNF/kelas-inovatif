import { NextApiRequest, NextApiResponse } from "next";
import { signInAction } from "../../../auth/signin/server-action";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const result = await signInAction(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Sign-in error:", error);
      return res
        .status(500)
        .json({ error: "Terjadi kesalahan saat proses sign-in." });
    }
  }

  return res
    .setHeader("Allow", ["POST"])
    .status(405)
    .end(`Method ${req.method} Not Allowed`);
}
