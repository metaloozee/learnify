"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusSquare, RotateCw } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { createNewSubject } from "@/lib/actions"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export const CreateSubjectButton = () => {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant={"default"} className="max-w-fit shadow-xl">
                        <PlusSquare className="mr-2 h-4 w-4" /> Create Subject
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a New Subject</DialogTitle>
                    </DialogHeader>
                    <SubjectForm />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant={"default"} className="max-w-fit shadow-xl">
                    <PlusSquare className="mr-2 h-4 w-4" /> Create Subject
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Create a New Subject</DrawerTitle>
                </DrawerHeader>
                <SubjectForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export const subjectFormSchema = z.object({
    subjectname: z.string().min(5).max(50),
    subjectdescription: z.string().min(10).max(120),
})

const SubjectForm = ({ className }: React.ComponentProps<"form">) => {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof subjectFormSchema>>({
        resolver: zodResolver(subjectFormSchema),
    })

    return (
        <form
            onSubmit={form.handleSubmit(async (data) => {
                await createNewSubject(data).then((value: any) => {
                    return toast({
                        title: value.title,
                        description: value.description,
                        variant: value.variant ?? "default",
                    })
                })
            })}
            className={cn("grid items-start gap-4", className)}
        >
            <div className="grid gap-2">
                <Label className="text-muted-foreground" htmlFor="name">
                    Give your subject a cool name:
                </Label>
                <Input
                    type="name"
                    id="name"
                    placeholder="Quantum Physics"
                    {...form.register("subjectname")}
                />
            </div>
            <div className="grid gap-2">
                <Label className="text-muted-foreground" htmlFor="description">
                    A brief description for your subject:
                </Label>
                <Textarea
                    id="description"
                    placeholder="Unravel the mysteries of particles, explore the wave-particle duality, and dive into the fascinating world where reality blurs."
                    {...form.register("subjectdescription")}
                />
            </div>
            {form.formState.isSubmitting ? (
                <Button className="w-full" disabled type="submit">
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                </Button>
            ) : (
                <Button type="submit">Create Subject</Button>
            )}
        </form>
    )
}
