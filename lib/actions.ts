"use server"

import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { env } from "@/env.mjs"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai"
import { PineconeStore } from "@langchain/pinecone"
import { Pinecone } from "@pinecone-database/pinecone"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import * as z from "zod"

import { Database } from "@/types/supabase"
import { CreateEnrollmentSchema } from "@/components/create-enrollment"
import { CreateNoteFormSchema } from "@/components/create-note-btn"
import { subjectFormSchema } from "@/components/create-subject-btn"
import { deleteAccountFormSchema } from "@/components/delete-account-form"
import { ContentSchema } from "@/components/generate-content"
import {
    deleteSubjectFormSchema,
    editSbjectFormSchema,
} from "@/components/manage-subject"
import { NotesPlaygroundFormSchema } from "@/components/notes-playground"
import { onboardFormSchema } from "@/components/onboard-form"
import { QuizFormSchema } from "@/components/quiz"
import { accountSettingsFormSchema } from "@/components/settings-form"
import { deleteEnrollmentSchema } from "@/components/student-data-table"
import { UploadNotesFormSchema } from "@/components/upload-notes"

const pinecone = new Pinecone({
    apiKey: env.PINECONE_API_KEY,
})
const pineconeIndex = pinecone.Index("learnify")
const openai = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-0125",
})
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 })

export const uploadNote = async (
    formData: z.infer<typeof UploadNotesFormSchema>
) => {
    const supabase = await createServerActionClient<Database>({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    try {
        if (!session) {
            throw new Error("UNAUTHORIZED")
        }

        const { error } = await supabase.from("notes").insert({
            notetitle: "Uploaded Untitled Note",
            notecontent: formData.content,
            subjectid: formData.subjectid,
            teacherid: formData.teacherid,
        })

        if (error) {
            throw new Error(error.message)
        }

        return {
            status: "ok",
            title: "Success!",
            description: "Successfully created the note.",
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
        // await worker.terminate()
        revalidatePath(`/teacher/notes/${formData.subjectid}`)
    }
}

export const deleteEnrollment = async (
    formData: z.infer<typeof deleteEnrollmentSchema>
) => {
    const supabase = await createServerActionClient<Database>({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    try {
        if (!session) {
            throw new Error("UNAUTHORIZED")
        }

        const { error } = await supabase
            .from("studentenrollment")
            .delete()
            .eq("enrollmentid", formData.enrollmentid)

        if (error) {
            throw new Error(error.message)
        }

        return {
            status: "ok",
            title: "Success!",
            description: "Successfully Deleted the Enrollment.",
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
        revalidatePath(`/teacher/subject/${formData.subjectid}`)
    }
}

export const createNote = async (
    formData: z.infer<typeof CreateNoteFormSchema>
) => {
    const supabase = await createServerActionClient<Database>({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    try {
        if (!session) {
            throw new Error("UNAUTHORIZED")
        }

        const { error } = await supabase.from("notes").insert({
            notetitle: "Untitled",
            notecontent: "Click me in order to edit",
            subjectid: formData.subjectId,
            teacherid: formData.teacherId,
        })

        if (error) {
            throw new Error(error.message)
        }

        return {
            status: "ok",
            title: "Success!",
            description: "Successfully Created a New Note.",
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
        revalidatePath(`/teacher/subject/${formData.subjectId}`)
    }
}

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

        const docs = await textSplitter.createDocuments([
            formData.content ?? "",
        ])
        await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings({}), {
            pineconeIndex,
            maxConcurrency: 10,
        })

        const { error } = await supabase
            .from("notes")
            .update({
                notetitle: formData.title,
                notecontent: formData.content,
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

        const { error } = await supabase
            .from("notes")
            .update({
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

export const editSubject = async (
    formData: z.infer<typeof editSbjectFormSchema>
) => {
    const supabase = await createServerActionClient<Database>({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    try {
        if (!session) {
            throw new Error("UNAUTHORIZED")
        }

        const { error } = await supabase
            .from("subjects")
            .update({
                subjectname: formData.subjectname,
                description: formData.subjectdescription,
            })
            .eq("subjectid", formData.subjectid)

        if (error) {
            throw new Error(error.message)
        }

        return {
            status: "ok",
            title: "Success!",
            description: "Successfully Edited the Subject.",
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
        revalidatePath(`/teacher/subject/${formData.subjectid}`)
    }
}

export const deleteSubject = async (
    formData: z.infer<typeof deleteSubjectFormSchema>
) => {
    const supabase = await createServerActionClient<Database>({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    try {
        if (!session) {
            throw new Error("UNAUTHORIZED")
        }

        const { error } = await supabase
            .from("subjects")
            .delete()
            .eq("subjectid", formData.subjectid)

        if (error) {
            throw new Error(error.message)
        }

        return {
            status: "ok",
            title: "Success!",
            description: "Successfully Deleted the Subject.",
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
        revalidatePath(`/teacher/subject/${formData.subjectid}`)
    }
}

export const evaluateQuizAnswer = async (
    formData: z.infer<typeof QuizFormSchema>
) => {
    const supabase = await createServerActionClient<Database>({ cookies })

    const {
        data: { session },
    } = await supabase.auth.getSession()
    const { data: quizData } = await supabase
        .from("qna")
        .select("id, notes(noteid, notecontent)")
        .eq("id", formData.id)
        .single()

    try {
        if (!session) {
            throw new Error("UNAUTHORIZED")
        }

        if (!quizData) {
            throw new Error("Invalid quiz")
        }

        const q_embedding = await new OpenAIEmbeddings().embedQuery(
            formData.question
        )
        const results = await pineconeIndex.query({
            vector: q_embedding,
            topK: 2,
            includeMetadata: true,
            includeValues: false,
        })

        const messages = [
            new SystemMessage(`
            You are a Personal AI tutor and you just gave your student to solve a mini-quiz.
            You are being provided with the note's content, original question, original (correct) answer and student's answer.
            Your task is to evaluate student's answer based on the original question, original answer and the context provided below.
            If the student is wrong then just respond with a "false", if correct then respond with "true".
    
            Note's Content:
            ${results.matches[0].metadata?.text}
            `),

            new HumanMessage(`
            Original Question: ${formData.question}
            Original Answer: ${formData.answer}
            Student's Answer: ${formData.submittedAnswer}
            `),
        ]

        const chatRes = await openai.invoke(messages)

        if (chatRes.content === "true") {
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
                title: "Correct.",
                description: "The answer provided by you is correct!",
            }
        } else {
            return {
                status: "ok",
                title: "Incorrect.",
                description: "The answer provided by you is incorrect!",
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
        revalidatePath(`/student/notes/${quizData?.notes?.noteid}`)
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

        const messages = [
            new SystemMessage(`
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
            `),
            new HumanMessage(formData.notecontent),
        ]

        const res = await openai.invoke(messages)

        if (!res) {
            throw new Error(
                "An Unknown error occurred while generating mini-quiz."
            )
        }

        JSON.parse(res.content.toString()).forEach(
            async (q: any, index: number) => {
                const { error } = await supabase.from("qna").insert({
                    question: q.question,
                    answer: q.answer,
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

        const messages = [
            new SystemMessage(`
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
            `),
            new HumanMessage(formData.notecontent),
        ]

        const res = await openai.invoke(messages)

        if (!res) {
            throw new Error(
                "An Unknown error occurred while generating mini-quiz."
            )
        }

        const { error } = await supabase.from("generatedcontent").upsert({
            contentid: formData.contentid ?? randomUUID(),
            contenttitle: `[FLASHCARD] ${formData.notetitle}`,
            contentbody: res.content.toString(),
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

        const messages = [
            new SystemMessage(`
            You are a Personal AI tutor and your student learns better when the notes are provided to them in easy/simpler words.
            Your job is to paraphrase the following note generated by a teacher into a markdown (.mdx) code.
            Also, format the document properly, add headings, and subheadings, and use mdx components so that the text will be readable.
            You can also add additional data regarding your knowledge.
            `),
            new HumanMessage(formData.notecontent),
        ]

        const res = await openai.invoke(messages)

        if (!res) {
            throw new Error(
                "An Unknown error occurred while generating mini-quiz."
            )
        }

        const { error } = await supabase.from("generatedcontent").upsert({
            contentid: formData.contentid ?? randomUUID(),
            contenttitle: `[NOTE] ${formData.notetitle}`,
            contentbody: res.content.toString(),
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

export const deleteUser = async (
    formData: z.infer<typeof deleteAccountFormSchema>
) => {
    const supabase = await createServerActionClient<Database>({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    try {
        if (!session) {
            throw new Error("UNAUTHORIZED")
        }

        if (session.user.email !== formData.email) {
            throw new Error(
                "The user's email address and the provided email address do not match."
            )
        }

        const { error } = await supabase
            .from("users")
            .delete()
            .eq("username", formData.username)
        if (error) {
            throw new Error(error.message)
        }

        const { error: logOutError } = await supabase.auth.signOut()
        if (logOutError) {
            throw new Error(logOutError.message)
        }

        return {
            status: "ok",
            title: "Success!",
            description: "You have successfully deleted your account",
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
        revalidatePath("/account")
    }
}

export const createEnrollment = async (
    formData: z.infer<typeof CreateEnrollmentSchema>
) => {
    const supabase = await createServerActionClient<Database>({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    try {
        if (!session) {
            throw new Error("UNAUTHORIZED")
        }

        const { error } = await supabase.from("studentenrollment").insert({
            userid: formData.userid,
            subjectid: formData.subjectid,
        })

        if (error) {
            throw new Error(error.message)
        }

        return {
            status: "ok",
            title: "Success!",
            description: "You have successfully enrolled yourself.",
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
        revalidatePath("/subjects")
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
