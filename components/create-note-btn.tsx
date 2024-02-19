"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FilePlus2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { createNote } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export const CreateNoteFormSchema = z.object({
    subjectId: z.string(),
    teacherId: z.string(),
})

export const CreateNoteButton = ({
    id,
    teacherid,
}: {
    id: string
    teacherid: string
}) => {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof CreateNoteFormSchema>>({
        resolver: zodResolver(CreateNoteFormSchema),
        defaultValues: {
            subjectId: id,
            teacherId: teacherid,
        },
    })

    return (
        <form
            onSubmit={form.handleSubmit(async (data) => {
                await createNote(data).then((value: any) => {
                    return toast({
                        title: value.title,
                        description: value.description,
                        variant: value.variant ?? "default",
                    })
                })
            })}
        >
            <Button
                disabled={form.formState.isSubmitting}
                className="max-w-fit shadow-xl"
                type="submit"
            >
                <FilePlus2 className="mr-2 h-4 w-4" /> Create Note
            </Button>
        </form>
    )
}
