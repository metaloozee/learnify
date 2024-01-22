import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { createServerSupabaseClient } from "@/app/supabase-server"

export type Note = {
    notecontent: string
    noteid: string
    notetitle: string
    subjectid: string | null
    teacherid: string | null
    updated_at: string | null
}

const getNote = async ({
    q,
    subjectid,
    limit = 10,
    type,
}: {
    q?: string | null
    subjectid: string
    limit?: number
    type: "student" | "teacher"
}) => {
    const supabase = await createServerSupabaseClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (type === "teacher") {
        if (q) {
            return await supabase
                .from("notes")
                .select("*")
                .eq("teacherid", session?.user.id ?? "")
                .eq("subjectid", subjectid)
                .textSearch("notecontent", q, {
                    type: "websearch",
                })
        }

        return await supabase
            .from("notes")
            .select("*")
            .eq("teacherid", session?.user.id ?? "")
            .eq("subjectid", subjectid)
            .limit(limit)
    }

    if (type === "student") {
        if (q) {
            return await supabase
                .from("notes")
                .select("*")
                .eq("subjectid", subjectid)
                .textSearch("notecontent", q, {
                    type: "websearch",
                })
        }

        return await supabase
            .from("notes")
            .select("*")
            .eq("subjectid", subjectid)
            .limit(limit)
    }
}

export const NotesCard = async ({
    q,
    subjectid,
    type,
}: {
    q?: string
    subjectid: string
    type: "student" | "teacher"
}) => {
    const notes = await getNote({ q: q, subjectid: subjectid, type })

    return notes && notes.data && notes.data.length > 0 ? (
        notes.data.map((note, index) => (
            <Link
                key={index}
                className="hover:-translate-y-1 transition-all duration-200"
                href={`/${type}/notes/${note.noteid}`}
            >
                <Card className="h-full w-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Badge className="max-w-fit" variant={"outline"}>
                            {new Date(note.updated_at as string)
                                .toUTCString()
                                .slice(0, 17)}
                        </Badge>
                    </CardHeader>

                    <CardContent>
                        <div className="text-2xl font-bold">
                            {note.notetitle}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {note.notecontent.slice(0, 100)}
                            {"..."}
                        </p>
                    </CardContent>
                </Card>
            </Link>
        ))
    ) : (
        <p className="text-md text-muted-foreground col-span-3">
            Uh-oh! The notes shelf is looking as empty as a student's backpack
            after finals.
        </p>
    )
}
