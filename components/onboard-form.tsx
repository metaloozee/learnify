"use client"

import { redirect } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Session } from "@supabase/supabase-js"
import { BookText, Presentation, RotateCw } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { createUser } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"

export const onboardFormSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email().optional(),
    first_name: z.string().min(2).max(50),
    last_name: z.string().min(0).max(50),
    type: z.enum(["teacher", "student"]),
})

export const OnboardForm = ({ session }: { session: Session }) => {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof onboardFormSchema>>({
        resolver: zodResolver(onboardFormSchema),
        defaultValues: {
            email: session.user.email,
            type: "student",
        },
    })

    return (
        <div className="container border rounded-xl p-10 bg-background/30 backdrop-blur-md">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(async (data) => {
                        await createUser(data).then((value: any) => {
                            return toast({
                                title: value.title,
                                description: value.description,
                                variant: value.variant ?? "default",
                            })
                        })
                        form.reset()
                        redirect("/")
                    })}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        How should we uniquely address you
                                        around here?
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            disabled
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your email address</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <h1 className="mt-8 text-sm font-medium">
                        Tell us more about yourself
                    </h1>
                    <div className="grid grid-cols-2 gap-2 md:gap-10">
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="First Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="last_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Last Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <h1 className="mt-8 text-sm font-medium">
                        Your position or responsibility here is?
                    </h1>
                    <div>
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-10"
                                        >
                                            <FormItem>
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value="student"
                                                        id="student"
                                                        className="peer sr-only"
                                                    />
                                                </FormControl>
                                                <FormLabel
                                                    htmlFor="student"
                                                    className="transition-all duration-200 w-full flex rounded-md border-2 border-muted hover:border-muted-foreground/50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <Card className="w-full border-none shadow-none">
                                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                            <BookText />
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div className="text-2xl font-bold">
                                                                Student
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem>
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value="teacher"
                                                        id="teacher"
                                                        className="peer sr-only"
                                                    />
                                                </FormControl>
                                                <FormLabel
                                                    htmlFor="teacher"
                                                    className="transition-all duration-200 w-full flex rounded-md border-2 border-muted hover:border-muted-foreground/50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                >
                                                    <Card className="w-full border-none shadow-none">
                                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                            <Presentation />
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div className="text-2xl font-bold">
                                                                Teacher
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-full mt-10">
                        {form.formState.isSubmitting ? (
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
                </form>
            </Form>
        </div>
    )
}
