"use client"

import * as React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

export const FlashCard = ({
    title,
    answer,
}: {
    title: string
    answer: string
}) => {
    const [displayAnswer, setDisplayAnswer] = React.useState(false)

    return (
        <Card
            onClick={() => setDisplayAnswer(!displayAnswer)}
            className="hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full w-full"
        >
            <CardHeader className="text-sm flex flex-row items-center justify-between space-y-0 pb-0"></CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{title}</div>
                {displayAnswer ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                        {answer}
                    </p>
                ) : (
                    <></>
                )}
            </CardContent>
        </Card>
    )
}
