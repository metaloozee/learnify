"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, GraduationCap, RotateCw, Send } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { evaluateQuizAnswer } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export type QuizProps = {
    answer: string
    id: string
    noteid: string
    question: string
    studentid: string
    graded: boolean | null
}

export const QuizFormSchema = z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string(),
    submittedAnswer: z.string(),
})

export const Quiz = ({ quiz }: { quiz: QuizProps }) => {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof QuizFormSchema>>({
        resolver: zodResolver(QuizFormSchema),
        defaultValues: {
            id: quiz.id,
            question: quiz.question,
            answer: quiz.answer,
        },
    })

    return (
        <form
            onSubmit={form.handleSubmit(async (data) => {
                await evaluateQuizAnswer(data).then((value: any) => {
                    return toast({
                        title: value.title,
                        description: value.description,
                        variant: value.variant ?? "default",
                    })
                })
            })}
        >
            <Card>
                <CardHeader>
                    <CardTitle>{quiz.question}</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-5 w-full">
                    <Input
                        placeholder="Your answer..."
                        disabled={quiz.graded ?? false}
                        defaultValue={quiz.graded ? quiz.answer : undefined}
                        {...form.register("submittedAnswer")}
                    />

                    {quiz.graded ? (
                        <Button variant={"outline"} disabled type="submit">
                            <Check className="h-4 w-4" />
                        </Button>
                    ) : form.formState.isSubmitting ? (
                        <Button variant={"outline"} disabled type="submit">
                            <RotateCw className="h-4 w-4 animate-spin" />
                        </Button>
                    ) : (
                        <Button variant={"outline"} type="submit">
                            <Send className="h-4 w-4" />
                        </Button>
                    )}
                </CardContent>
            </Card>
        </form>
    )
}
