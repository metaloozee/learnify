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
}: {
    q?: string | null
    subjectid: string
    limit?: number
}) => {
    const supabase = await createServerSupabaseClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()

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

export const NotesCard = async ({
    q,
    subjectid,
}: {
    q?: string
    subjectid: string
}) => {
    const notes = await getNote({ q: q, subjectid: subjectid })

    return notes.data
        ? notes.data.map((note, index) => (
              <Link
                  key={index}
                  className="hover:-translate-y-1 transition-all duration-200"
                  href={`/teacher/notes/${note.noteid}`}
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
        : "nuh uh"
}
