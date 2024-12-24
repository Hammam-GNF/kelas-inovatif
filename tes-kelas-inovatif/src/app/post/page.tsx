"use client";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { toast } from "sonner";
import { createPostAction } from "./@post";
import { postSchema } from "./validation";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";

export function CreatePostForm() {
	const { form, handleSubmitWithAction, resetFormAndAction } =
		useHookFormAction(createPostAction, zodResolver(postSchema), {
			actionProps: {
				onSuccess: ({ data }) => {
					toast.success(data?.message);
					resetFormAndAction();
				},
				onError: ({ error }) => {
					toast.error(error?.serverError);
				},
			},
			formProps: {
				defaultValues: {
					title: "",
					content: "",
				},
			},
			errorMapProps: {
				joinBy: " dan ",
			},
		});

	return (
		<Card className="max-w-md w-full mx-auto">
			<CardHeader>
				<CardTitle>Buat Postingan</CardTitle>
				<CardDescription>Masukkan detail postingan baru.</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={handleSubmitWithAction} className="space-y-8">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Judul</FormLabel>
									<FormControl>
										<Input placeholder="Masukkan judul" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Konten</FormLabel>
									<FormControl>
										<Input placeholder="Masukkan konten" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? "Loading..." : "Buat Post"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
