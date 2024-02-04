"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Session } from "@supabase/supabase-js"
import { BookCheck, RotateCw, Save } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { UserData } from "@/components/navbar"
import { useSupabase } from "@/app/supabase-provider"
import type { NoteData } from "@/app/teacher/notes/[id]/page"
import type { Subject } from "@/app/teacher/page"

interface NotesPlaygroundProps {
    session: Session
    user: UserData
    subject: Subject
    note: NoteData
}

const NotesPlaygroundFormSchema = z.object({
    title: z.string().optional(),
    content: z.string().min(10).optional(),
    description: z.string().optional(),
})

export const NotesPlayground = ({
    session,
    user,
    subject,
    note,
}: NotesPlaygroundProps) => {
    const { supabase } = useSupabase()
    const { toast } = useToast()

    const [loading, setLoading] = React.useState(false)
    const [width, setWidth] = React.useState(window.innerWidth)

    React.useEffect(() => {
        const handleWindowSizeChange = () => {
            setWidth(window.innerWidth)
        }

        window.addEventListener("resize", handleWindowSizeChange)

        return () => {
            window.removeEventListener("resize", handleWindowSizeChange)
        }
    }, [])

    const form = useForm<z.infer<typeof NotesPlaygroundFormSchema>>({
        resolver: zodResolver(NotesPlaygroundFormSchema),
        defaultValues: {
            title: note.notetitle,
            content: note.notecontent,
            description: note.notecontent.slice(0, 50),
        },
    })

    const onSave = async (
        values: z.infer<typeof NotesPlaygroundFormSchema>
    ) => {
        try {
            setLoading(true)

            const { error } = await supabase
                .from("notes")
                .update({
                    notetitle: values.title,
                    notecontent: values.content,
                })
                .eq("noteid", note.noteid)
            if (error) {
                throw new Error(error.message)
            }

            return toast({
                title: "Success!",
                description: "You have successfully updated the note.",
            })
        } catch (e: any) {
            console.error(e)

            form.reset()

            return toast({
                title: "Oops! Something went wrong.",
                description: e.message,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (
        values: z.infer<typeof NotesPlaygroundFormSchema>
    ) => {
        try {
            setLoading(true)

            const { error } = await supabase
                .from("notes")
                .update({
                    notetitle: values.title,
                    notecontent: values.content,
                    is_published: true,
                })
                .eq("noteid", note.noteid)
            if (error) {
                throw new Error(error.message)
            }

            console.log("sendind email")
            await fetch("/api/send")

            return toast({
                title: "Success!",
                description: "You have successfully published the note.",
            })
        } catch (e: any) {
            console.error(e)

            form.reset()

            return toast({
                title: "Oops! Something went wrong.",
                description: e.message,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {width >= 786 ? (
                    <ResizablePanelGroup
                        direction="horizontal"
                        className="gap-5"
                    >
                        <ResizablePanel defaultSize={80}>
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Lorem Ipsum"
                                                className="col-span-3 p-4 min-h-[520px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel className="flex flex-col justify-between">
                            <div className="flex flex-col gap-5">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">
                                                Note Title
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Lorem Ipsum"
                                                    className="p-4"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    disabled
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">
                                                Description
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Lorem Ipsum"
                                                    className="p-4 resize-none"
                                                    disabled
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:gap-5">
                                {note.is_published ? (
                                    <></>
                                ) : (
                                    <Button
                                        className="w-full"
                                        type="submit"
                                        variant={"secondary"}
                                    >
                                        <BookCheck className="mr-2 h-4 w-4" />
                                        Publish
                                    </Button>
                                )}
                                {loading ? (
                                    <Button className="w-full" disabled>
                                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                        Please Wait
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full"
                                        type="submit"
                                        onClick={form.handleSubmit(onSave)}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        Save
                                    </Button>
                                )}
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                ) : (
                    <div className="flex flex-col gap-5">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">
                                        Note Title
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Lorem Ipsum"
                                            className="p-4"
                                            {...field}
                                        />
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
                                    <FormLabel className="text-xs">
                                        Note Content
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Lorem Ipsum"
                                            className="col-span-3 p-4 min-h-[520px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {loading ? (
                            <Button className="w-full" disabled type="submit">
                                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                Please Wait
                            </Button>
                        ) : (
                            <Button className="w-full" type="submit">
                                Submit
                            </Button>
                        )}
                    </div>
                )}
            </form>
        </Form>
    )
}
