"use client"

import React, { useState } from "react"
import { GraduationCap, RotateCw } from "lucide-react"
import * as z from "zod"

import { evaluateQuizAnswer } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export type QuizProps = {
    contentid: string
    studentid: string
    noteid: string
    quiz: {
        id: number
        question: string
        answer: string
    }[]
}

export const QuizSchema = z
    .object({
        id: z.number(),
        question: z.string(),
        originalAnswer: z.string(),
        submittedAnswer: z.string().min(5).optional(),
    })
    .array()

export const Quiz: React.FC<{ quiz: QuizProps }> = ({ quiz }) => {
    const { toast } = useToast()

    const [submittedAnswers, setSubmittedAnswers] = useState<
        z.infer<typeof QuizSchema>
    >([])
    const [loading, setLoading] = useState(false)

    const handleAnswerChange = (index: number, value: string) => {
        setSubmittedAnswers((prevAnswers) => {
            const newAnswers = [...prevAnswers]
            newAnswers[index] = { ...newAnswers[index], submittedAnswer: value }
            return newAnswers
        })
    }

    return (
        <form
            onSubmit={async (e: React.FormEvent) => {
                e.preventDefault()
                setLoading(true)

                const mappedAnswers = submittedAnswers.map(
                    (submittedAnswer, index) => {
                        const { id, question, answer } = quiz.quiz[index]
                        return {
                            id,
                            question,
                            originalAnswer: answer,
                            submittedAnswer:
                                submittedAnswer?.submittedAnswer || "",
                        }
                    }
                )

                await evaluateQuizAnswer(mappedAnswers).then((value: any) => {
                    setLoading(false)
                    return toast({
                        title: value.title,
                        description: value.description,
                        variant: value.variant ?? "default",
                    })
                })
            }}
            className="border p-4 rounded-xl w-full grid grid-cols-1 md:grid-cols-2 gap-5"
        >
            {quiz.quiz.map((q, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle>{q.question}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-5 w-full">
                        <Input
                            placeholder="Your answer..."
                            value={
                                submittedAnswers[index]?.submittedAnswer || ""
                            }
                            onChange={(e) =>
                                handleAnswerChange(index, e.target.value)
                            }
                        />
                    </CardContent>
                </Card>
            ))}
            {loading ? (
                <Button className="col-span-2" disabled type="submit">
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                </Button>
            ) : (
                <Button className="col-span-2" type="submit">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Hit Me with that Score
                </Button>
            )}
        </form>
    )
}
