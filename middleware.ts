import { NextFetchEvent, NextRequest, NextResponse } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

import type { Database } from "@/types/supabase"

export async function middleware(req: NextRequest, event: NextFetchEvent) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient<Database>({ req, res })
    const key = decodeURIComponent(req.nextUrl.pathname.split("/")[1])

    const ip = req.ip

    const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, "10 s"),
    })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (session && key.length == 0) {
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("userid", session?.user.id ?? "")
            .maybeSingle()

        if (!userData || userError) {
            return NextResponse.redirect(new URL("/onboarding", req.url))
        }

        if (userData.usertype === "student") {
            return NextResponse.redirect(new URL("/student", req.url))
        }

        if (userData.usertype === "teacher") {
            return NextResponse.redirect(new URL("/teacher", req.url))
        }
    } else {
        const { success, pending } = await ratelimit.limit(`mw_${ip}`)
        event.waitUntil(pending)

        if (!success) {
            return NextResponse.redirect(new URL("/api/blocked", req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
}
