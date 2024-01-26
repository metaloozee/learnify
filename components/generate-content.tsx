"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CookingPot } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { generateContent } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

type Note = {
    notecontent: string
    noteid: string
    notetitle: string
    subjectid: string | null
    teacherid: string | null
    updated_at: string | null
}

type Content = {
    contentbody: string
    contentid: string
    contenttitle: string
    contenttype: string
    noteid: string | null
    studentid: string | null
}

type GenerateContentProps = {
    children: React.ReactNode
    note: Note
    content: Content | null
    studentid: string
}

export const ContentSchema = z.object({
    noteid: z.string(),
    notecontent: z.string(),
    notetitle: z.string(),
    contentid: z.string().nullable(),
    studentid: z.string(),
})

export const GenerateContentButton = ({
    children,
    note,
    content,
    studentid,
}: GenerateContentProps) => {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof ContentSchema>>({
        resolver: zodResolver(ContentSchema),
        defaultValues: {
            noteid: note.noteid,
            contentid: content?.contentid ?? null,
            studentid: studentid,
            notecontent: note.notecontent,
            notetitle: note.notetitle,
        },
    })

    return (
        <form
            onSubmit={form.handleSubmit(async (data) => {
                await generateContent(data).then((value: any) => {
                    return toast({
                        title: value.title,
                        description: value.description,
                        variant: value.variant ?? "default",
                    })
                })
            })}
        >
            <input
                id="noteid"
                className="hidden"
                {...form.register("noteid")}
            />
            <input
                id="notetitle"
                className="hidden"
                {...form.register("notetitle")}
            />
            <input
                id="notecontent"
                className="hidden"
                {...form.register("notecontent")}
            />
            <input
                id="studentid"
                className="hidden"
                {...form.register("studentid")}
            />
            <input
                id="contentid"
                className="hidden"
                {...form.register("contentid")}
            />

            {form.formState.isSubmitting ? (
                <Button disabled asChild>
                    <span className="max-w-fit animate-pulse">
                        Cooking <CookingPot className="ml-2 h-4 w-4 " />
                    </span>
                </Button>
            ) : (
                <Button type="submit">{children}</Button>
            )}
        </form>
    )
}
