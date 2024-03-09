"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Session } from "@supabase/supabase-js"
import { Camera } from "lucide-react"
import { useForm } from "react-hook-form"
import { createWorker } from "tesseract.js"
import * as z from "zod"

import { uploadNote } from "@/lib/actions"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { type Subject } from "@/components/manage-subject"

export const UploadNotesFormSchema = z.object({
    subjectid: z.string(),
    // image: z.custom<File>((v) => v instanceof File, {
    //     message: "Image(s) is required",
    // }),
    content: z.string(),
    teacherid: z.string(),
})

export const UploadNotesBtn = ({
    subject,
    session,
}: {
    subject: Subject
    session: Session
}) => {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const [text, setText] = React.useState<string | null>(null)

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant={"outline"}
                        className="max-w-fit"
                        type="submit"
                    >
                        <Camera className="mr-2 h-4 w-4" />
                        Upload Notes
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Taking the easy step?</DialogTitle>
                        <DialogDescription>
                            Well... it's actually time saving innit?
                        </DialogDescription>
                    </DialogHeader>

                    <UploadForm subject={subject} session={session} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant={"outline"} className="max-w-fit" type="submit">
                    <Camera className="mr-2 h-4 w-4" />
                    Upload Notes
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Taking the easy step?</DrawerTitle>
                    <DrawerDescription>
                        Well... it's actually time saving innit?
                    </DrawerDescription>
                </DrawerHeader>

                <UploadForm
                    className="p-4"
                    subject={subject}
                    session={session}
                />
            </DrawerContent>
        </Drawer>
    )
}

const UploadForm = ({
    subject,
    session,
    className,
}: {
    subject: Subject
    session: Session
    className?: String
}) => {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof UploadNotesFormSchema>>({
        resolver: zodResolver(UploadNotesFormSchema),
        defaultValues: {
            subjectid: subject.subjectid,
            teacherid: session.user.id,
        },
    })

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        event.preventDefault()

        const files = event.target.files
        if (!files) return

        const worker = await createWorker("eng", 1, {
            logger: (m) => console.log(m),
        })
        const {
            data: { text },
        } = await worker.recognize(files[0])

        return form.setValue("content", text)
    }
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Input type="file" accept="image/*" onChange={handleFileUpload} />

            <form
                className="space-y-5"
                onSubmit={form.handleSubmit(async (data) => {
                    await uploadNote(data).then((value: any) => {
                        return toast({
                            title: value.title,
                            description: value.description,
                            variant: value.variant ?? "default",
                        })
                    })
                })}
            >
                <DialogDescription>
                    <Textarea
                        {...form.register("content")}
                        onChange={(e) =>
                            form.setValue("content", e.target.value)
                        }
                        disabled
                    />
                </DialogDescription>

                <DialogFooter>
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                    >
                        Create Note
                    </Button>
                </DialogFooter>
            </form>
        </div>
    )
}
