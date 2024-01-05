import Link from "next/link"
import { MoveRight, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function Index() {
    const supabase = await createServerSupabaseClient()

    return (
        <div className="mt-20 flex flex-col gap-5">
            <h1 className="text-3xl md:text-4xl">
                Discover Tailored Learning Experiences
            </h1>
            <p className="text-md text-muted-foreground">
                Engage in personalized learning that adapts to your pace and
                preferences. Experience a revolutionary approach that redefines
                the way we teach and learn.
            </p>

            <Button asChild className="max-w-fit">
                <Link href={"/"}>
                    Get Started <MoveRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>

            <div className="mt-12 grid grid-cols-3 gap-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Students
                        </CardTitle>
                        <Users className="w-3 h-3" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">450,000+</div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Notes Generated
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4,500,000+</div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Students
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">450,000+</div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
