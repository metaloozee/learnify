import { Bot, SendHorizonal } from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

export type ChatPlaygroundProps = {
    id: string
}
export const AiChatPlayground = ({ id }: ChatPlaygroundProps) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>
                    <Bot className="mr-2 w-4 h-4" />
                    Chat With Me
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full h-screen flex flex-col justify-between">
                <SheetHeader>
                    <SheetTitle>
                        <Bot className="mr-2 h-5 w-5" />
                        Hey there, human friend! 👋
                    </SheetTitle>
                    <SheetDescription className="text-xs">
                        I'm your virtual buddy here to make learning a breeze
                        and your doubts disappear faster than you can say
                        "supercalifragilisticexpialidocious"!
                    </SheetDescription>
                </SheetHeader>
                <SheetFooter>
                    <form className="w-full flex flex-row gap-2" action="">
                        <Input placeholder="Explain computer to a 5 year old" />
                        <Button type="submit">
                            <SendHorizonal className="w-4 h-4" />
                        </Button>
                    </form>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
