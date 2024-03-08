"use client"

import { useChat } from "ai/react"
import { Bot, SendHorizonal, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export const AiChatPlayground = () => {
    const { messages, input, handleInputChange, handleSubmit } = useChat()

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size={"icon"} variant={"outline"}>
                    <Bot className="w-4 h-4" />
                </Button>
            </SheetTrigger>
            <SheetContent className="container overflow-auto flex min-w-full">
                <SheetHeader className="text-left fixed backdrop-blur-md w-full">
                    <SheetTitle>
                        <Bot className="mr-2 h-5 w-5" />
                        Hey there, human friend! 👋
                    </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-auto mt-16 pb-16">
                    {messages.map((m, index) =>
                        m.role === "user" ? (
                            <div className="py-4 px-2 rounded bg-muted">
                                <User className="h-4 w-4" />
                                {m.content}
                            </div>
                        ) : (
                            <div className="my-2 py-4 px-2 rounded bg-green-100/50">
                                <Bot className="h-4 w-4" />
                                {m.content}
                            </div>
                        )
                    )}
                </ScrollArea>
                <SheetFooter className="fixed bottom-5 pr-12 bg-white w-full">
                    <form
                        className="w-full flex flex-row gap-2"
                        onSubmit={handleSubmit}
                    >
                        <Input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Explain computer to a 5 year old"
                        />
                        <Button type="submit">
                            <SendHorizonal className="w-4 h-4" />
                        </Button>
                    </form>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
