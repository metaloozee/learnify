"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { Session } from "@supabase/supabase-js"
import { BookText, Presentation } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"

const onboardFormSchema = z.object({
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

    const onSubmit = (values: z.infer<typeof onboardFormSchema>) => {
        return toast({
            title: "SUIIII",
            description: `${values.username} ${values.first_name} ${values.last_name} ${values.type}`,
        })
    }

    return (
        <div className="container border rounded-xl p-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-10">
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
                                            placeholder="username"
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
                    <div className="grid grid-cols-2 gap-10">
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
                        Your position or responsibility here is
                    </h1>
                    <div className="grid grid-cols-1 gap-10">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="mt-1 grid grid-cols-2 gap-10"
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
                                                    className="w-full flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:border-muted-foreground/50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
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
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value="teacher"
                                                        id="teacher"
                                                        className="peer sr-only"
                                                    />
                                                </FormControl>
                                                <FormLabel
                                                    htmlFor="teacher"
                                                    className="w-full flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:border-muted-foreground/50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
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
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
