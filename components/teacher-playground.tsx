"use client"

import React from "react"
import type { Session } from "@supabase/supabase-js"
import * as z from "zod"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { UserData } from "@/components/navbar"
import { useSupabase } from "@/app/supabase-provider"
import type { NoteData } from "@/app/teacher/notes/[id]/page"
import type { Subject } from "@/app/teacher/page"

interface TeacherPlaygroundProps {
    session: Session
    user: UserData
    subject: Subject
    note: NoteData
}

export const TeacherPlayground = ({
    session,
    user,
    subject,
    note,
}: TeacherPlaygroundProps) => {
    const { supabase } = useSupabase()

    return (
        <div>
            <h1 className="text-3xl md:text-4xl">
                Exciting Things Are{" "}
                <span className="text-muted-foreground">Coming Soon!</span>
            </h1>
            <p className="text-md text-muted-foreground">
                Stay tuned for our upcoming launch. We can't wait to share it
                with you.
            </p>

            <Card className="mt-10 flex flex-col justify-between">
                <div>
                    <CardHeader className="flex flex-wrap flex-row items-center justify-between gap-2 space-y-0 pb-2">
                        <Badge className="max-w-fit" variant={"default"}>
                            RAW DATA
                        </Badge>
                        <Badge className="max-w-fit" variant={"outline"}>
                            {user.first_name} {user.last_name}
                        </Badge>
                        <Badge className="max-w-fit" variant={"outline"}>
                            {subject.subjectname}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <h1 className="mt-2 text-2xl font-bold">
                            {note.notetitle}
                        </h1>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {note.notecontent}
                        </p>
                    </CardContent>
                </div>
            </Card>
        </div>
    )
}
