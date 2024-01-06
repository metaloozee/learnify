import Link from "next/link"
import { ListTodo, ScrollText, WalletCards } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default async function Index() {
    return (
        <div className="mt-20 flex flex-col gap-5 justify-center items-center">
            <h1 className="text-3xl md:text-4xl">
                Discover Tailored Learning Experiences
            </h1>
            <p className="text-md text-muted-foreground">
                Engage in personalized learning that adapts to your pace and
                preferences. Experience a revolutionary approach that redefines
                the way we teach and learn.
            </p>

            {/* <Button asChild className="max-w-fit">
                <Link href={"/"}>Get Started</Link>
            </Button> */}

            <div className="mt-8 grid grid-cols-3 gap-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <WalletCards className="w-3 h-3" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Flash Cards</div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Master concepts effortlessly with AI-driven
                            flashcards, adapting to your unique learning style.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <ScrollText className="w-3 h-3" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            Personalized Notes
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Explore personalized notes, where AI transforms your
                            course content into a tailored learning experience.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <ListTodo className="w-3 h-3" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            Personalized Mini Quiz
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Challenge your knowledge with AI-enhanced mini
                            quizzes, providing personalized assessments for
                            effective learning.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
