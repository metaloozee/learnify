"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { Description } from "@radix-ui/react-toast"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import * as z from "zod"

import { Database } from "@/types/supabase"
import { accountSettingsFormSchema } from "@/components/settings-form"

export const updateUserSettings = async (
    formData: z.infer<typeof accountSettingsFormSchema>
) => {
    const supabase = await createServerActionClient<Database>({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()
    const { data: user } = await supabase
        .from("users")
        .select("username")
        .eq("userid", session?.user.id ?? "")
        .single()

    try {
        const username = formData.username.replace(/\s+/g, "").toLowerCase()

        if (username !== user?.username) {
            const { data: existingUsername, error: existingUsernameError } =
                await supabase
                    .from("users")
                    .select("*")
                    .eq("username", username)
                    .maybeSingle()

            if (existingUsername) {
                throw new Error(
                    "There alreasy exists a user with that username."
                )
            }
            if (existingUsernameError) {
                throw new Error(existingUsernameError.message)
            }
        }
        const { error: userUpdateError } = await supabase
            .from("users")
            .update({
                username: username,
                first_name: formData.first_name,
                last_name: formData.last_name,
            })
            .eq("userid", session?.user.id ?? "")
        if (userUpdateError) {
            throw new Error(userUpdateError.message)
        }

        return {
            status: "ok",
            title: "Success!",
            description: "You have successfully updated yourself.",
        }
    } catch (e: any) {
        return {
            status: "error",
            title: "Oops! Something went wrong.",
            description: e.message,
            variant: "destructive",
        }
    } finally {
        revalidatePath("/account")
    }
}
