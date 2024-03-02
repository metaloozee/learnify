"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { Session } from "@supabase/supabase-js"
import { RotateCw, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { deleteUser } from "@/lib/actions"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import type { UserData } from "@/components/navbar"

export const deleteAccountFormSchema = z.object({
    username: z.string(),
    email: z.string().email(),
})

export const DeleteAccountForm = ({
    session,
    user,
}: {
    session: Session
    user: UserData
}) => {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof deleteAccountFormSchema>>({
        resolver: zodResolver(deleteAccountFormSchema),
        defaultValues: {
            username: user.username,
        },
    })

    return (
        <div className="container border rounded-xl p-10 w-full bg-background/30 backdrop-blur-md">
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger>
                        <h1 className="text-xl">
                            Delete My Account{" "}
                            <span className="text-muted-foreground">
                                {" "}
                                / Danger
                            </span>
                        </h1>
                    </AccordionTrigger>
                    <AccordionContent>
                        <h1 className="text-xl">Are you absolutely sure?</h1>
                        <p>
                            This action cannot be undone. This will permanently
                            delete all your records including the subjects and
                            the contents from our servers.
                        </p>
                        <p className="text-muted-foreground">
                            (Note: Your students wont be enrolled in the
                            subjects you have created)
                        </p>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(async (data) => {
                                    await deleteUser(data).then(
                                        (value: any) => {
                                            return toast({
                                                title: value.title,
                                                description: value.description,
                                                variant:
                                                    value.variant ?? "default",
                                            })
                                        }
                                    )
                                    form.reset()
                                })}
                                className="mt-10 flex flex-row items-end gap-2"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Enter your email:
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="w-[500px]"
                                                    placeholder="john.doe@domain.name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {form.formState.isSubmitting ? (
                                    <Button
                                        disabled
                                        type="submit"
                                        className="max-w-fit"
                                        variant={"destructive"}
                                    >
                                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                        Please Wait
                                    </Button>
                                ) : (
                                    <Button
                                        className="max-w-fit"
                                        variant={"destructive"}
                                        type="submit"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4 " />
                                        Delete
                                    </Button>
                                )}
                            </form>
                        </Form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
