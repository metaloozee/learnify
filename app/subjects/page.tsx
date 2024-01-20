import { Suspense } from "react"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { SkeletonCard } from "@/components/subject-card"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function SubjectsIndexPage() {
    const supabase = await createServerSupabaseClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const { data: subjects } = await supabase
        .from("subjects")
        .select("*, users(*)")

    const handleSubmit = async (formData: FormData) => {
        "use server"

        const supabase = createServerActionClient({ cookies })

        try {
            const { error } = await supabase.from("studentenrollment").insert({
                userid: session?.user.id,
                subjectid: formData.get("subjectid") as string,
            })

            if (error) {
                throw new Error(error.message)
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            revalidatePath("/subjects")
        }
    }

    return (
        <div className="mt-20 flex flex-col gap-2 md:gap-5">
            <h1 className="text-3xl md:text-4xl">
                Explore Diverse Subjects{" "}
                <span className="text-muted-foreground">
                    and Ignite Your Curiosity!
                </span>
            </h1>
            <p className="text-sm md:text-md text-muted-foreground">
                Embark on a learning journey tailored to your interests. Choose
                from a wide array of subjects, each offering a unique
                exploration into the fascinating world of knowledge. Enroll
                today and unlock the doors to a personalized and enriching
                educational experience.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10">
                <Suspense
                    fallback={
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    }
                >
                    {subjects?.map(async (subject, index) => {
                        const { data: studentData } = await supabase
                            .from("studentenrollment")
                            .select("*")
                            .eq("userid", session?.user.id ?? "")
                            .eq("subjectid", subject.subjectid)
                            .single()

                        return (
                            <form key={index} action={handleSubmit}>
                                <Card className="h-full flex flex-col justify-between">
                                    <div>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <Badge
                                                className="max-w-fit"
                                                variant={"outline"}
                                            >
                                                {subject?.users?.first_name}{" "}
                                                {subject?.users?.last_name}
                                            </Badge>
                                        </CardHeader>
                                        <CardContent>
                                            <h1 className="mt-2 text-2xl font-bold">
                                                {subject?.subjectname}
                                            </h1>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {subject?.description}
                                            </p>
                                        </CardContent>
                                    </div>
                                    {session ? (
                                        <CardFooter>
                                            {studentData ? (
                                                <Button
                                                    className="w-full"
                                                    disabled
                                                >
                                                    Already Enrolled
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    className="w-full"
                                                >
                                                    Enroll
                                                </Button>
                                            )}
                                        </CardFooter>
                                    ) : (
                                        <CardFooter>
                                            <Button className="w-full" disabled>
                                                Login to Enroll
                                            </Button>
                                        </CardFooter>
                                    )}
                                    <input
                                        type="text"
                                        name="subjectid"
                                        value={subject.subjectid}
                                        className="hidden"
                                    />
                                </Card>
                            </form>
                        )
                    })}
                </Suspense>
            </div>
        </div>
    )
}
