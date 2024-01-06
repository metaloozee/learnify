import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function StudentIndexPage() {
    const supabase = await createServerSupabaseClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("userid", session?.user.id ?? "")
        .eq("usertype", "student")
        .maybeSingle()

    return session && userData ? (
        <div className="mt-20 flex flex-col gap-5">
            <h1 className="text-3xl md:text-4xl">
                Hey there{" "}
                <span className="text-muted-foreground">
                    {userData.first_name}
                </span>
            </h1>
            <p className="text-md text-muted-foreground">
                Your learning journey awaits. Explore your subjects, dive into
                personalized content, and embark on a knowledge-filled adventure
                tailored just for you. Click on any subject card below to begin
                your exploration.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                        Teacher's Name Here
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            Advanced Computer Networks
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Master concepts effortlessly with AI-driven
                            flashcards, adapting to your unique learning style.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                        Teacher's Name Here
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            Advanced Computer Networks
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Master concepts effortlessly with AI-driven
                            flashcards, adapting to your unique learning style.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                        Teacher's Name Here
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            Advanced Computer Networks
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Master concepts effortlessly with AI-driven
                            flashcards, adapting to your unique learning style.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                        Teacher's Name Here
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            Advanced Computer Networks
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Master concepts effortlessly with AI-driven
                            flashcards, adapting to your unique learning style.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                        Teacher's Name Here
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            Advanced Computer Networks
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Master concepts effortlessly with AI-driven
                            flashcards, adapting to your unique learning style.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    ) : (
        <div className="mt-20 flex flex-col gap-5">
            <h1 className="text-3xl md:text-4xl">Unauthorized</h1>
            <p className="text-md text-muted-foreground">
                You don't have the necessary privileges to view this page.
            </p>
        </div>
    )
}
