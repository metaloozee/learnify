"use server"

import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { env } from "@/env.mjs"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import * as z from "zod"

import { Database } from "@/types/supabase"
import { subjectFormSchema } from "@/components/create-subject-btn"
import { ContentSchema } from "@/components/generate-content"
import { onboardFormSchema } from "@/components/onboard-form"
import { QuizSchema } from "@/components/quiz"
import { accountSettingsFormSchema } from "@/components/settings-form"

export const createNewSubject = async (
    formData: z.infer<typeof subjectFormSchema>
) => {
    const supabase = await createServerActionClient<Database>({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()
    const { data: userData } = await supabase
        .from("users")
        .select("userid")
        .eq("userid", session?.user.id ?? "")
        .eq("usertype", "teacher")
        .maybeSingle()

    try {
        if (!userData) {
            throw new Error("UNAUTHORIZED")
        }

        const { error } = await supabase.from("subjects").insert({
            subjectname: formData.subjectname,
            description: formData.subjectdescription,
            teacherid: userData.userid,
        })
        if (error) {
            throw new Error(error.message)
        }
        return {
            status: "ok",
            title: "Success!",
            description: "Successfully created Subject.",
        }
    } catch (e: any) {
        console.error(e)
        return {
            status: "error",
            title: "Oops! Something went wrong.",
            description: e.message,
            variant: "destructive",
        }
    } finally {
        revalidatePath("/teacher")
    }
}

export const evaluateQuizAnswer = async (
    formData: z.infer<typeof QuizSchema>
) => {
    const supabase = await createServerActionClient<Database>({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    try {
        if (!session) {
            throw new Error("UNAUTHORIZED")
        }

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
                            You are a Personal AI tutor and your student learns better using mini-quiz.
                            You already gave one of your student a Quiz to solve, and they did solve it but rather than grading them tradiotionally your job is to see if your student understood the question or not.
                            You need to find the accuracy of the answer submitted by him and accordingly grade him below 1.
                            The data of the quiz will be provided to you, the question denotes the original question asked; the answer is the correct answer to that question; the submittedanswer is the answer submitted by your student.
                            Depending on the number of questions you are supposed to respond with [score]/[number of questions].
                            NOTE: You are not supposed to give 1 even if the answer is 100% correct.
                        `,
                    },
                    {
                        role: "user",
                        content: JSON.stringify(formData),
                    },
                ],
            }),
        })
        if (!res.ok) {
            throw new Error(res.statusText)
        }

        const response = await res.json()
        console.log(response.choices[0].message.content)
        return {
            status: "ok",
            title: "Success!",
            description: `Your score is ${response.choices[0].message.content}`,
        }
    } catch (e: any) {
        console.error(e)
        return {
            status: "error",
            title: "Oops! Something went wrong.",
            description: e.message,
            variant: "destructive",
        }
    } finally {
        revalidatePath(`/student/notes/*`)
    }
}

export const generatePersonalizedMiniQuiz = async (
    formData: z.infer<typeof ContentSchema>
) => {
    const supabase = await createServerActionClient<Database>({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    try {
        if (!session) {
            throw new Error("UNAUTHORIZED")
        }

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
                            You are a Personal AI tutor and your student learns better using mini-quiz.
                            Your job is to paraphrase the following note and generate a mini-quiz for the important points in the following json format.
                            The quiz should either contain a single-line answer to a question or a single word answer to the question.
                            Provide minimum 10 questions

                            [
                                {
                                    id: 1,
                                    question: "question which will be displayed to the user",
                                    answer: "answer to the question"
                                },
                                {
                                    id: 2,
                                    question: "question which will be displayed to the user",
                                    answer: "answer to the question"
                                }
                            ]
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

        const generatedQuiz = await res.json()

        const { error } = await supabase.from("generatedcontent").upsert({
            contentid: formData.contentid ?? randomUUID(),
            contenttitle: `[QUIZ] ${formData.notetitle}`,
            contentbody: generatedQuiz.choices[0].message.content,
            contenttype: "quiz",
            noteid: formData.noteid,
            studentid: session?.user.id,
        })
        if (error) {
            throw new Error(error.message)
        }

        return {
            status: "ok",
            title: "Success!",
            description: "Successfully generated Personalized Quiz.",
        }
    } catch (e: any) {
        console.error(e)
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

export const generatePersonalizedFlashCards = async (
    formData: z.infer<typeof ContentSchema>
) => {
    const supabase = await createServerActionClient<Database>({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    try {
        if (!session) {
            throw new Error("UNAUTHORIZED")
        }

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
                            You are a Personal AI tutor and your student learns better using flashcards.
                            Your job is to paraphrase the following note and generate flashcards for the important points in the following json format.
                            The flashcards should either contain a single-line answer to a question or a single word answer to the question.

                            [
                                {
                                    id: 1,
                                    flashcard_title: "title which will be displayed on the cover",
                                    flashcard_answer: "answer which will be displayed when the user clicks on the card"
                                },
                                {
                                    id: 2,
                                    flashcard_title: "title which will be displayed on the cover",
                                    flashcard_answer: "answer which will be displayed when the user clicks on the card"
                                }
                            ]
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

        const generatedFlashCards = await res.json()

        const { error } = await supabase.from("generatedcontent").upsert({
            contentid: formData.contentid ?? randomUUID(),
            contenttitle: `[FLASHCARD] ${formData.notetitle}`,
            contentbody: generatedFlashCards.choices[0].message.content,
            contenttype: "flash_cards",
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
        console.error(e)
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

export const generatePersonalizedNote = async (
    formData: z.infer<typeof ContentSchema>
) => {
    const supabase = await createServerActionClient<Database>({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    try {
        if (!session) {
            throw new Error("UNAUTHORIZED")
        }

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
        if (!session) {
            throw new Error("UNAUTHORIZED")
        }

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
        if (!session) {
            throw new Error("UNAUTHORIZED")
        }

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
