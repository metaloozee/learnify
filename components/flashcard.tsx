import * as React from "react"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"

export const FlashCard = ({
    title,
    answer,
}: {
    title: string
    answer: string
}) => {
    return (
        <Card className="px-5 py-2 container hover:-translate-y-1 transition-all duration-200 h-full w-full bg-background/30 backdrop-blur-md">
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger>
                        <h1 className="text-left text-xl">{title}</h1>
                    </AccordionTrigger>
                    <AccordionContent>
                        <p className="text-left text-muted-foreground">
                            {answer}
                        </p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
    )
}
