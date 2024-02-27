import Image from "next/image"
import Link from "next/link"
import FlashCard from "@/public/_static/illustrations/flashcard.svg"
import Notes from "@/public/_static/illustrations/notes.svg"
import Quiz from "@/public/_static/illustrations/quiz.svg"
import Remote from "@/public/_static/illustrations/remote.svg"
import { ArrowRightIcon, GitHubLogoIcon } from "@radix-ui/react-icons"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UserAccount } from "@/components/account-btn"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function Index() {
    const supabase = await createServerSupabaseClient()

    const { count: contentStats } = await supabase
        .from("generatedcontent")
        .select("*", { count: "estimated", head: true })
    const { count: qnaStats } = await supabase
        .from("qna")
        .select("*", { count: "estimated", head: true })
    const { count: studentCount } = await supabase
        .from("users")
        .select("*", { count: "estimated", head: true })
        .eq("usertype", "student")
    const { count: subjectCount } = await supabase
        .from("subjects")
        .select("*", { count: "estimated", head: true })

    const generatedContentStats =
        contentStats && qnaStats && contentStats + qnaStats

    return (
        <main className="flex-1">
            <section className="w-full mt-48 md:mt-0">
                <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                    <div className="flex flex-col justify-center items-center md:items-start space-y-4">
                        <div className="space-y-2 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl">
                                Discover Tailored Learning Experiences
                            </h1>
                            <p className="max-w-[600px] text-md text-muted-foreground">
                                Engage in personalized learning that adapts to
                                your pace and preferences. Experience a
                                revolutionary approach that redefines the way we
                                teach and learn.
                            </p>
                        </div>
                        <UserAccount user={null} userData={null}>
                            <>
                                Login to Get Started
                                <ArrowRightIcon className="ml-2 group-hover:translate-x-1 group-hover:ml-4 transition-all duration-200" />
                            </>
                        </UserAccount>
                    </div>
                    <AspectRatio ratio={1 / 1}>
                        <Image
                            src={Remote}
                            alt="Learnify"
                            fill
                            className="rounded-xl object-cover"
                        />
                    </AspectRatio>
                </div>
            </section>
            <section className="relative w-full min-h-[100px] bg-muted/30 backdrop-blur-lg rounded-full border">
                <div className="container grid grid-cols-3 justify-items-center py-5">
                    <div className="flex flex-row">
                        <div className="text-center">
                            <h1 className="font-bold text-xl md:text-4xl">
                                {studentCount}+
                            </h1>
                            <p className="max-w-[600px] text-xs md:text-md text-muted-foreground">
                                Students
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <div className="text-center">
                            <h1 className="font-bold text-xl md:text-4xl">
                                {generatedContentStats}+
                            </h1>
                            <p className="max-w-[600px] text-xs md:text-md text-muted-foreground">
                                Contents Generated
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <div className="text-center">
                            <h1 className="font-bold text-xl md:text-4xl">
                                {subjectCount}+
                            </h1>
                            <p className="max-w-[600px] text-xs md:text-md text-muted-foreground">
                                Subjects
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full my-12">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl">
                                Personalized Learning Features
                            </h1>
                            <p className="max-w-[900px] text-md text-muted-foreground">
                                Learnify offers a variety of features to enhance
                                your learning experience. From personalized
                                notes to interactive quizzes, we've got you
                                covered.
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                        <Card className="group relative rounded-lg overflow-hidden p-4">
                            <CardContent>
                                <AspectRatio ratio={1 / 1}>
                                    <Image
                                        src={Notes}
                                        alt="Learnify"
                                        fill
                                        className="rounded-xl object-cover"
                                    />
                                </AspectRatio>
                            </CardContent>
                            <Separator />
                            <CardFooter className="py-4 flex flex-col text-center">
                                <CardTitle className="text-xl">Notes</CardTitle>
                                <CardDescription>
                                    Create and customize your own notes for each
                                    subject. Highlight, underline, and add
                                    comments to your notes.
                                </CardDescription>
                            </CardFooter>
                        </Card>
                        <Card className="group relative rounded-lg overflow-hidden p-4">
                            <CardContent>
                                <AspectRatio ratio={1 / 1}>
                                    <Image
                                        src={FlashCard}
                                        alt="Learnify"
                                        fill
                                        className="rounded-xl object-cover"
                                    />
                                </AspectRatio>
                            </CardContent>
                            <Separator />
                            <CardFooter className="py-4 flex flex-col text-center">
                                <CardTitle className="text-xl">
                                    Flash Cards
                                </CardTitle>
                                <CardDescription>
                                    Use flashcards to review key concepts and
                                    terms. Customize your flashcards with
                                    images, colors, and more.
                                </CardDescription>
                            </CardFooter>
                        </Card>
                        <Card className="group relative rounded-lg overflow-hidden p-4">
                            <CardContent>
                                <AspectRatio ratio={1 / 1}>
                                    <Image
                                        src={Quiz}
                                        alt="Learnify"
                                        fill
                                        className="rounded-xl object-cover"
                                    />
                                </AspectRatio>
                            </CardContent>
                            <Separator />
                            <CardFooter className="py-4 flex flex-col text-center">
                                <CardTitle className="text-xl">
                                    Quizzes
                                </CardTitle>
                                <CardDescription>
                                    Test your knowledge with interactive
                                    quizzes. Get instant feedback and track your
                                    progress over time.
                                </CardDescription>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </section>
            <section className="container w-full min-h-[100px] bg-muted/30 backdrop-blur-lg md:rounded-full rounded-xl border px-5 py-10">
                <div className="flex flex-col justify-between items-center gap-2 text-center">
                    <h1 className="font-bold text-xl md:text-3xl">
                        Our Project is Open Source!
                    </h1>
                    <p className="max-w-[600px] text-xs md:text-md text-muted-foreground">
                        Dive into the enchanted realm of our codebase! Wizards
                        and sorceresses, feel free to inspect, enchant, and even
                        summon your own additions. We welcome all brave
                        contributors on this epic coding quest!
                    </p>
                    <Button className="mt-5" asChild>
                        <Link href="https://github.com/metaloozee/learnify">
                            <GitHubLogoIcon className="h-6 w-6 mr-2" />
                            GitHub
                        </Link>
                    </Button>
                </div>
            </section>
        </main>
    )
}
