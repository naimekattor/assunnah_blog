import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await req.json()
        const { path, referrer, sessionId } = body

        const userAgent = req.headers.get("user-agent") || ""
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || ""

        const {
            data: { user },
        } = await supabase.auth.getUser()

        const { error } = await supabase.from("page_views").insert({
            path,
            referrer,
            user_agent: userAgent,
            ip_address: ip,
            user_id: user?.id || null,
            session_id: sessionId,
        })

        if (error) {
            console.error("Analytics error:", error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error("Tracking API error:", err)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
