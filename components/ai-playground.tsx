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
            <SheetContent className="w-full overflow-auto flex flex-col justify-between">
                <SheetHeader className="text-left">
                    <SheetTitle>
                        <Bot className="mr-2 h-5 w-5" />
                        Hey there, human friend! 👋
                    </SheetTitle>
                    <SheetDescription className="text-xs pb-5">
                        I'm your virtual buddy here to make learning a breeze
                        and your doubts disappear faster than you can say
                        "supercalifragilisticexpialidocious"!
                    </SheetDescription>
                    <ScrollArea className="h-[500px]">
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
                </SheetHeader>
                <SheetFooter>
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
