import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { MoreVertical, RotateCcw, Trash2 } from "lucide-react"

import { Database } from "@/types/supabase"
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotesPlayground } from "@/components/notes-playground"
import { createServerSupabaseClient } from "@/app/supabase-server"

export type NoteData = {
    is_published: boolean
    notecontent: string
    noteid: string
    notetitle: string
    subjectid: string | null
    teacherid: string | null
    updated_at: string | null
}

export default async function TeacherNotesIndexPage({
    params,
}: {
    params: any
}) {
    const supabase = await createServerSupabaseClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()
    const { data: teacherData } = await supabase
        .from("users")
        .select("*")
        .eq("userid", session?.user.id ?? "")
        .eq("usertype", "teacher")
        .single()
    const { data: noteData } = await supabase
        .from("notes")
        .select("*")
        .eq("noteid", params.id)
        .single()
    const { data: subjects } = await supabase
        .from("subjects")
        .select("subjectname, subjectid")
        .eq("teacherid", teacherData?.userid ?? "")
    const { data: subjectData } = await supabase
        .from("subjects")
        .select("*")
        .eq("subjectid", noteData?.subjectid ?? "")
        .eq("teacherid", teacherData?.userid ?? "")
        .single()

    const unPublishNote = async () => {
        "use server"
        const supabase = await createServerActionClient<Database>({ cookies })

        try {
            const { error } = await supabase
                .from("notes")
                .update({
                    is_published: false,
                })
                .eq("noteid", noteData?.noteid ?? "")
            if (error) {
                throw new Error(error.message)
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            revalidatePath(`/teacher/notes/${noteData?.noteid ?? ""}`)
        }
    }

    const deleteNote = async () => {
        "use server"
        const supabase = await createServerActionClient<Database>({ cookies })

        try {
            const { error } = await supabase
                .from("notes")
                .delete()
                .eq("noteid", noteData?.noteid ?? "")
            if (error) {
                throw new Error(error.message)
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            revalidatePath(`/teacher/notes/${noteData?.noteid ?? ""}`)
        }
    }

    return session && teacherData && noteData && subjectData ? (
        <div className="w-full flex flex-col gap-5">
            <div className="flex flex-row justify-between items-center gap-5">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    <BreadcrumbEllipsis className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    {subjects &&
                                        subjects.map((s, index) => (
                                            <DropdownMenuItem key={index}>
                                                <BreadcrumbLink
                                                    href={`/teacher/subject/${s.subjectid}`}
                                                >
                                                    {s.subjectname}
                                                </BreadcrumbLink>
                                            </DropdownMenuItem>
                                        ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                {noteData.notetitle}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <form action={unPublishNote}>
                            <DropdownMenuItem disabled={!noteData.is_published}>
                                <Button
                                    variant={"ghost"}
                                    size={null}
                                    type="submit"
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Un-Publish Note
                                </Button>
                            </DropdownMenuItem>
                        </form>
                        <DropdownMenuSeparator />
                        <form action={deleteNote}>
                            <DropdownMenuItem>
                                <Button
                                    variant={"ghost"}
                                    size={null}
                                    type="submit"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Note
                                </Button>
                            </DropdownMenuItem>
                        </form>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="mt-5 w-full">
                <NotesPlayground
                    session={session}
                    user={teacherData}
                    subject={subjectData}
                    note={noteData}
                />
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
