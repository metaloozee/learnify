import Image from "next/image"
import Link from "next/link"
import FlashCard from "@/public/_static/illustrations/flashcard.svg"
import Notes from "@/public/_static/illustrations/notes.svg"
import Quiz from "@/public/_static/illustrations/quiz.svg"
import Remote from "@/public/_static/illustrations/remote.svg"
import Teacher from "@/public/_static/illustrations/teacher.svg"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { AspectRatio } from "@/components/ui/aspect-ratio"
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

export default async function Index() {
    return (
        <main className="flex-1">
            <section className="w-full pb-12 mt-32 md:mt-0">
                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
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
            <Separator />
            <section className="w-full py-12">
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
            <Separator />
            <section className="w-full py-12">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl">
                                Empowering Teachers
                            </h1>
                            <p className="max-w-[900px] text-md text-muted-foreground">
                                Learnify is not just for students. Teachers can
                                create and upload subject-specific notes, create
                                quizzes, and monitor student progress.
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                        <Image
                            className="mx-auto overflow-hidden rounded-xl object-cover lg:order-last lg:aspect-square"
                            src={Teacher}
                            alt="Learnify"
                            height={500}
                            width={500}
                        />
                        <div className="flex flex-col justify-center space-y-4">
                            <Accordion
                                className="w-full"
                                collapsible
                                type="single"
                            >
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-sm md:text-lg">
                                        Create and Upload Notes
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        Teachers can create and upload their own
                                        notes for each subject, providing
                                        students with additional resources for
                                        learning.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-sm md:text-lg">
                                        Create Quizzes
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        Teachers can create quizzes to test
                                        student understanding and provide
                                        instant feedback.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-sm md:text-lg">
                                        Monitor Student Progress
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        Track student progress over time and
                                        identify areas where students may need
                                        additional support.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
