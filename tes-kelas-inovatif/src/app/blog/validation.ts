import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, { message: "Judul diperlukan" }),
  content: z.string().min(1, { message: "Konten diperlukan" }),
});

export type Post = z.infer<typeof postSchema>;
