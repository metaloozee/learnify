import { createServerSupabaseClient } from "@/app/supabase-server"

export default async function Index() {
    const supabase = await createServerSupabaseClient()

    return (
        <div className="flex flex-col justify-center items-center gap-10">
            <h1 className="text-center text-2xl md:text-3xl font-light">
                Hello World
            </h1>
           
        </div>
    )
}
