"use server"

import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { env } from "@/env.mjs"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { all, create } from "mathjs"
import * as z from "zod"

import { Database } from "@/types/supabase"
import { subjectFormSchema } from "@/components/create-subject-btn"
import { ContentSchema } from "@/components/generate-content"
import { NotesPlaygroundFormSchema } from "@/components/notes-playground"
import { onboardFormSchema } from "@/components/onboard-form"
import { QuizFormSchema } from "@/components/quiz"
import { accountSettingsFormSchema } from "@/components/settings-form"

export const saveNote = async (
    formData: z.infer<typeof NotesPlaygroundFormSchema>
) => {
    const supabase = await createServerActionClient<Database>({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    try {
        if (!session) {
            throw new Error("UNAUTHORIZED")
        }

        const res = await fetch("https://api.openai.com/v1/embeddings", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input: formData.content,
                model: "text-embedding-3-large",
            }),
        })
        const embedding = await res.json()

        const { error } = await supabase
            .from("notes")
            .update({
                notetitle: formData.title,
                notecontent: formData.content,
                embeddings: embedding.data[0].embedding,
            })
            .eq("noteid", formData.noteid)
        if (error) {
            throw new Error(error.message)
        }
        return {
            status: "ok",
            title: "Success!",
            description: "Successfully updated the Note.",
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
        revalidatePath(`/teacher/notes/${formData.noteid}`)
    }
}

export const publishNote = async (
    formData: z.infer<typeof NotesPlaygroundFormSchema>
) => {
    const supabase = await createServerActionClient<Database>({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    try {
        if (!session) {
            throw new Error("UNAUTHORIZED")
        }

        const res = await fetch("https://api.openai.com/v1/embeddings", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input: formData.content,
                model: "text-embedding-3-large",
            }),
        })
        const embedding = await res.json()

        const { error } = await supabase
            .from("notes")
            .update({
                notetitle: formData.title,
                notecontent: formData.content,
                embeddings: embedding.data[0].embedding,
                is_published: true,
            })
            .eq("noteid", formData.noteid)
        if (error) {
            throw new Error(error.message)
        }
        return {
            status: "ok",
            title: "Success!",
            description: "Successfully Published the Note.",
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
        revalidatePath(`/teacher/notes/${formData.noteid}`)
    }
}

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
    formData: z.infer<typeof QuizFormSchema>
) => {
    const math = create(all, {})

    const supabase = await createServerActionClient<Database>({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()
    const { data: quizData } = await supabase
        .from("qna")
        .select("answer_embedding, id")
        .eq("id", formData.id)
        .single()

    try {
        if (!session) {
            throw new Error("UNAUTHORIZED")
        }

        if (!quizData) {
            throw new Error("Invalid quiz")
        }

        const res = await fetch("https://api.openai.com/v1/embeddings", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input: formData.submittedAnswer,
                model: "text-embedding-3-small",
            }),
        })
        const embedding = await res.json()

        const a = math.matrix(JSON.parse(quizData.answer_embedding))
        const b = math.matrix(embedding.data[0].embedding)
        const score = math.dot(a, b)

        if (score > 0.6) {
            const { error } = await supabase
                .from("qna")
                .update({
                    graded: true,
                })
                .eq("id", quizData.id)
            if (error) {
                throw new Error(error.message)
            }

            return {
                status: "ok",
                title: "Correct",
            }
        } else {
            return {
                status: "ok",
                title: "Incorrect",
                variant: "destructive",
            }
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
                model: "gpt-3.5-turbo-0125",
                messages: [
                    {
                        role: "system",
                        content: `
                            You are a Personal AI tutor and your student learns better using mini-quiz.
                            Your job is to paraphrase the following note and generate a mini-quiz for the important points in the following json format.
                            The quiz should either contain a single-line answer to a question or a single word answer to the question.
                            Provide minimum 10 questions
                            Do not use single quotes while providing me with the output

                            [
                                {
                                    "id": 1,
                                    "question": "question which will be displayed to the user",
                                    "answer": "answer to the question"
                                },
                                {
                                    "id": 2,
                                    "question": "question which will be displayed to the user",
                                    "answer": "answer to the question"
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
        const q_res = await fetch("https://api.openai.com/v1/embeddings", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input: JSON.parse(generatedQuiz.choices[0].message.content).map(
                    (q: any) => q.question
                ),
                model: "text-embedding-3-small",
            }),
        })
        if (!q_res.ok) {
            console.error(q_res.statusText)
        }
        const q_embeddings = await q_res.json()

        const a_res = await fetch("https://api.openai.com/v1/embeddings", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input: JSON.parse(generatedQuiz.choices[0].message.content).map(
                    (q: any) => q.answer
                ),
                model: "text-embedding-3-small",
            }),
        })
        if (!a_res.ok) {
            console.error(q_res.statusText)
        }
        const a_embeddings = await a_res.json()

        JSON.parse(generatedQuiz.choices[0].message.content).forEach(
            async (q: any, index: number) => {
                const { error } = await supabase.from("qna").insert({
                    question: q.question,
                    question_embedding: q_embeddings.data[index].embedding,
                    answer: q.answer,
                    answer_embedding: a_embeddings.data[index].embedding,
                    noteid: formData.noteid,
                    studentid: formData.studentid,
                })
                if (error) {
                    throw new Error(error.message)
                }
            }
        )

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
                model: "gpt-3.5-turbo-0125",
                messages: [
                    {
                        role: "system",
                        content: `
                            You are a Personal AI tutor and your student learns better using flashcards.
                            Your job is to paraphrase the following note and generate flashcards for the important points in the following json format.
                            The flashcards should either contain a single-line answer to a question or a single word answer to the question.
                            Do not use single quotes while providing me with the output
                            
                            [
                                {
                                    "id": 1,
                                    "flashcard_title": "title which will be displayed on the cover",
                                    "flashcard_answer": "answer which will be displayed when the user clicks on the card"
                                },
                                {
                                    "id": 2,
                                    "flashcard_title": "title which will be displayed on the cover",
                                    "flashcard_answer": "answer which will be displayed when the user clicks on the card"
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
                model: "gpt-3.5-turbo-0125",
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
