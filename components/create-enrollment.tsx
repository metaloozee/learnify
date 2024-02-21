"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type Session } from "@supabase/supabase-js"
import { RotateCw } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { createEnrollment } from "@/lib/actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export type Subject = {
    description: string | null
    subjectid: string
    subjectname: string
    teacherid: string | null
    users: {
        first_name: string | null
        last_name: string | null
        userid: string
        username: string
        usertype: string
    } | null
}

export const CreateEnrollmentSchema = z.object({
    userid: z.string(),
    subjectid: z.string(),
})

export const CreateEnrollment = ({
    subject,
    userEnrollmentSubjectIds,
    session,
}: {
    subject: Subject
    userEnrollmentSubjectIds: string[]
    session: Session | null
}) => {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof CreateEnrollmentSchema>>({
        resolver: zodResolver(CreateEnrollmentSchema),
        defaultValues: {
            userid: session?.user.id,
            subjectid: subject.subjectid,
        },
    })

    if (!session)
        return (
            <div className="mt-20 flex flex-col gap-5">
                <h1 className="text-3xl md:text-4xl">Unauthorized</h1>
                <p className="text-md text-muted-foreground">
                    You don't have the necessary privileges to view this page.
                </p>
            </div>
        )

    if (userEnrollmentSubjectIds?.includes(subject.subjectid)) {
        return (
            <Card className="h-full flex flex-col justify-between">
                <div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Badge className="max-w-fit" variant={"outline"}>
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
                <CardFooter>
                    <Button className="w-full" disabled>
                        Already Enrolled
                    </Button>
                </CardFooter>
            </Card>
        )
    }
    return (
        <form
            onSubmit={form.handleSubmit(async (data) => {
                await createEnrollment(data).then((value: any) => {
                    return toast({
                        title: value.title,
                        description: value.description,
                        variant: value.variant ?? "default",
                    })
                })
                form.reset()
            })}
        >
            <Card className="h-full flex flex-col justify-between">
                <div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Badge className="max-w-fit" variant={"outline"}>
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
                <CardFooter>
                    {form.formState.isSubmitting ? (
                        <Button className="w-full" disabled type="submit">
                            <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                            Please Wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full">
                            Enroll
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </form>
    )
}
