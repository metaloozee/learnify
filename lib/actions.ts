"use server"

import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { env } from "@/env.mjs"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import * as z from "zod"

import { Database } from "@/types/supabase"
import { ContentSchema } from "@/components/generate-content"
import { onboardFormSchema } from "@/components/onboard-form"
import { accountSettingsFormSchema } from "@/components/settings-form"

export const generateContent = async (
    formData: z.infer<typeof ContentSchema>
) => {
    const supabase = await createServerActionClient<Database>({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            headers: {
                Authorization: `Bearer ${env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `
                            You are a Personal AI tutor and your student learns better when the notes are provided to them in easy/simpler words.
                            Your job is to paraphrase the following note generated by a teacher into a markdown (.mdx) code.
                            Also, format the document properly, add headings, and subheadings, and use mdx components so that the text will be readable.
                            You can also add additional data regarding your knowledge.
                            `,
                    },
                    {
                        role: "user",
                        content: formData.notecontent,
                    },
                ],
            }),
        })
        if (!res.ok) {
            throw new Error(res.statusText)
        }

        const generatedNote = await res.json()

        const { error } = await supabase.from("generatedcontent").upsert({
            contentid: formData.contentid ?? randomUUID(),
            contenttitle: `[NOTE] ${formData.notetitle}`,
            contentbody: generatedNote.choices[0].message.content,
            contenttype: "note",
            noteid: formData.noteid,
            studentid: session?.user.id,
        })
        if (error) {
            throw new Error(error.message)
        }
        return {
            status: "ok",
            title: "Success!",
            description: "Successfully generated Personalized Note.",
        }
    } catch (e: any) {
        return {
            status: "error",
            title: "Oops! Something went wrong.",
            description: e.message,
            variant: "destructive",
        }
    } finally {
        revalidatePath(`/student/notes/${formData.noteid}`)
    }
}

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

export const createUser = async (
    formData: z.infer<typeof onboardFormSchema>
) => {
    const supabase = await createServerActionClient({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    try {
        const username = formData.username.replace(/\s+/g, "").toLowerCase()

        const { data: existingUsername, error: existingUsernameError } =
            await supabase
                .from("users")
                .select("*")
                .eq("username", username)
                .maybeSingle()

        if (existingUsername) {
            throw new Error("There alreasy exists a user with that username.")
        }
        if (existingUsernameError) {
            throw new Error(existingUsernameError.message)
        }

        const { error: userError } = await supabase.from("users").insert({
            userid: session?.user.id,
            username: username,
            usertype: formData.type,
            first_name: formData.first_name,
            last_name: formData.last_name,
        })
        if (userError) {
            throw new Error(userError.message)
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
        revalidatePath("/onboarding")
    }
}
