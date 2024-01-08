"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { Session } from "@supabase/supabase-js"
import { RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import type { SubjectData } from "@/components/subject-card"
import { useSupabase } from "@/app/supabase-provider"

export const SubmitEnrollmentButton = ({
    subject,
    session,
}: {
    subject: SubjectData
    session: Session | null
}) => {
    const router = useRouter()
    const { toast } = useToast()
    const { supabase } = useSupabase()

    const [loading, setLoading] = React.useState(false)

    const handleSubmit = async () => {
        try {
            setLoading(true)

            // Fetching the original list
            const { data: userSubjects } = await supabase
                .from("users")
                .select("subjects")
                .eq("userid", session?.user.id ?? "")
                .single()

            const newSubjects = [
                subject.subjectid,
                ...(userSubjects?.subjects || []),
            ] as string[]

            // Updating to the database
            const { error } = await supabase
                .from("users")
                .update({
                    subjects: newSubjects,
                })
                .eq("userid", session?.user.id ?? "")

            if (error) {
                throw new Error(error.message)
            }

            return toast({
                title: "Hooray!!",
                description: "You have successfully enrolled yourself",
            })
        } catch (e: any) {
            console.error(e)
            return toast({
                title: "Uh oh!",
                description: e.message,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
            return router.refresh()
        }
    }

    return loading ? (
        <Button className="w-full" disabled type="submit">
            <RotateCw className="mr-2 h-4 w-4 animate-spin" />
            Please Wait
        </Button>
    ) : (
        <Button className="w-full" onClick={handleSubmit}>
            Enroll
        </Button>
    )
}
