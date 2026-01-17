import { createAdminClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const supabase = createAdminClient()
        const { token, password } = await request.json()

        if (!token || !password) {
            return NextResponse.json(
                { error: "Token and password are required" },
                { status: 400 }
            )
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters long" },
                { status: 400 }
            )
        }

        // Verify the token exists and is not expired
        const { data: resetToken, error: tokenError } = await supabase
            .from("password_reset_tokens")
            .select("*")
            .eq("token", token)
            .eq("used", false)
            .gt("expires_at", new Date().toISOString())
            .single()

        if (tokenError || !resetToken) {
            return NextResponse.json(
                { error: "Invalid or expired reset token" },
                { status: 400 }
            )
        }

        // Update the user's password using Supabase Auth Admin API
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            resetToken.user_id,
            { password: password }
        )

        if (updateError) {
            console.error("Error updating password:", updateError)
            return NextResponse.json(
                { error: "Failed to update password" },
                { status: 500 }
            )
        }

        // Mark the token as used
        const { error: markUsedError } = await supabase
            .from("password_reset_tokens")
            .update({ used: true })
            .eq("token", token)

        if (markUsedError) {
            console.error("Error marking token as used:", markUsedError)
            // Don't fail the request, password was already updated
        }

        return NextResponse.json({
            message: "Password updated successfully",
        })
    } catch (error) {
        console.error("Unexpected error in reset-password:", error)
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        )
    }
}
