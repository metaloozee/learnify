"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { SendHorizonal } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export type QuizProps = {
    contentid: string
    studentid: string
    contentbody: string
    noteid: string
}

export const QuizSchema = z.object({
    question: z.string(),
    answer: z.string(),
    submittedAnswer: z.string().min(5),
})

export const Quiz = ({
    question,
    answer,
}: {
    question: string
    answer: string
}) => {
    const form = useForm<z.infer<typeof QuizSchema>>({
        resolver: zodResolver(QuizSchema),
        defaultValues: {
            question,
            answer,
        },
    })

    const evaluateForm = async (values: z.infer<typeof QuizSchema>) => {
        const accuracy = new RegExp(`\\b${values.answer}\\b`, "i").test(
            values.submittedAnswer
        )

        console.log(accuracy)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(evaluateForm)}>
                <Card>
                    <CardHeader>
                        <CardTitle>{question}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-5 w-full">
                        <FormField
                            control={form.control}
                            name="submittedAnswer"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input
                                            placeholder="Your Answer Goes Here.."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" variant={"outline"}>
                            <SendHorizonal className="h-3 w-3" />
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
