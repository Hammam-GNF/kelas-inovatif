import { returnValidationErrors } from "next-safe-action";
import { actionClient } from "@/lib/safe-action";
import { postSchema } from "./validation";
import { revalidatePath } from "next/cache";

export const createBlogPostAction = actionClient
	.schema(postSchema)
	.action(async ({ parsedInput }) => {

        const newPost = {
			title: parsedInput.title,
			content: parsedInput.content,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const isPostValid = newPost.title && newPost.content;

		if (!isPostValid) {
			return returnValidationErrors(postSchema, {
				_errors: ["Data postingan tidak valid"],
			});
		}
		revalidatePath("/dashboard/posts-list");
		return {
			message: "Postingan berhasil dibuat",
			post: newPost,
		};
	});
