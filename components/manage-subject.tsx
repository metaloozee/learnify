"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Settings2, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { deleteSubject, editSubject } from "@/lib/actions"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export type Subject = {
    description: string | null
    subjectid: string
    subjectname: string
    teacherid: string | null
}

export const editSbjectFormSchema = z.object({
    subjectid: z.string(),
    subjectname: z.string().min(5).max(50),
    subjectdescription: z.string().min(10).max(120),
})

export const deleteSubjectFormSchema = z.object({
    subjectid: z.string(),
})

export const ManageSubject = ({ subject }: { subject: Subject }) => {
    const [editOpen, setEditOpen] = React.useState(false)
    const [deleteOpen, setDeleteOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <div className="flex gap-2">
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogTrigger asChild>
                        <Button variant={"outline"}>
                            <Settings2 className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Subject</DialogTitle>
                            <DialogDescription>
                                Make changes to your Subject here. Click save
                                when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <EditSubjectForm subject={subject} />
                    </DialogContent>
                </Dialog>

                <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant={"outline"}>
                            <Trash2 className="text-red-500 h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your subject and remove your
                                data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <DeleteSubjectForm subject={subject} />
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        )
    }

    return (
        <div className="flex gap-2">
            <Drawer open={editOpen} onOpenChange={setEditOpen}>
                <DrawerTrigger asChild>
                    <Button variant={"outline"}>
                        <Settings2 className="h-4 w-4" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Edit Subject</DrawerTitle>
                        <DrawerDescription>
                            Make changes to your Subject here. Click save when
                            you're done.
                        </DrawerDescription>
                    </DrawerHeader>
                    <EditSubjectForm className={"p-4"} subject={subject} />
                </DrawerContent>
            </Drawer>

            <Drawer open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DrawerTrigger asChild>
                    <Button variant={"outline"}>
                        <Trash2 className="text-red-500 h-4 w-4" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                        <DrawerDescription>
                            This action cannot be undone. This will permanently
                            delete your subject and remove your data from our
                            servers.
                        </DrawerDescription>
                    </DrawerHeader>
                    <DeleteSubjectForm
                        className={"p-4 w-full justify-center"}
                        subject={subject}
                    />
                </DrawerContent>
            </Drawer>
        </div>
    )
}

const EditSubjectForm = ({
    subject,
    className,
}: {
    subject: Subject
    className?: String
}) => {
    const { toast } = useToast()

    const editSubjectForm = useForm<z.infer<typeof editSbjectFormSchema>>({
        resolver: zodResolver(editSbjectFormSchema),
        defaultValues: {
            subjectname: subject.subjectname,
            subjectdescription: subject.description ?? "",
            subjectid: subject.subjectid,
        },
    })

    return (
        <Form {...editSubjectForm}>
            <form
                onSubmit={editSubjectForm.handleSubmit(async (data) => {
                    await editSubject(data).then((value: any) => {
                        return toast({
                            title: value.title,
                            description: value.description,
                            variant: value.variant ?? "default",
                        })
                    })
                })}
                className={cn("grid gap-4 py-4", className)}
            >
                <FormField
                    control={editSubjectForm.control}
                    name="subjectname"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">Name</FormLabel>
                            <FormControl>
                                <Input {...field} className="col-span-3" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={editSubjectForm.control}
                    name="subjectdescription"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">
                                Description
                            </FormLabel>
                            <FormControl>
                                <Textarea {...field} className="col-span-3" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button
                        disabled={editSubjectForm.formState.isSubmitting}
                        type="submit"
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}

const DeleteSubjectForm = ({
    subject,
    className,
}: {
    subject: Subject
    className?: String
}) => {
    const { toast } = useToast()

    const deleteSubjectForm = useForm<z.infer<typeof deleteSubjectFormSchema>>({
        resolver: zodResolver(deleteSubjectFormSchema),
        defaultValues: {
            subjectid: subject.subjectid,
        },
    })

    return (
        <form
            className={cn("flex gap-2", className)}
            onSubmit={deleteSubjectForm.handleSubmit(async (data) => {
                await deleteSubject(data).then((value: any) => {
                    return toast({
                        title: value.title,
                        description: value.description,
                        variant: value.variant ?? "default",
                    })
                })
            })}
        >
            <Button
                disabled={deleteSubjectForm.formState.isSubmitting}
                type="submit"
                className="w-full"
            >
                Continue
            </Button>
        </form>
    )
}
