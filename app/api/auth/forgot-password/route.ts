import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { email } = await request.json()

        if (!email || !email.trim()) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            )
        }

        // Check if user exists (using Supabase Admin API would be better, but we'll use profiles)
        const { data: profile } = await supabase
            .from("profiles")
            .select("id, email")
            .eq("email", email.toLowerCase().trim())
            .single()

        // For security, always return success even if email doesn't exist
        // This prevents email enumeration attacks
        if (!profile) {
            return NextResponse.json({
                message: "If an account exists with this email, you will receive a password reset link.",
            })
        }

        // Generate a secure token
        const token = randomUUID()
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

        // Store the token in the database
        const { error: tokenError } = await supabase
            .from("password_reset_tokens")
            .insert({
                user_id: profile.id,
                token,
                expires_at: expiresAt.toISOString(),
                used: false,
            })

        if (tokenError) {
            console.error("Error creating reset token:", tokenError)
            return NextResponse.json(
                { error: "Failed to create reset token" },
                { status: 500 }
            )
        }

        // Send password reset email using Supabase Auth
        // Note: This uses Supabase's built-in password reset functionality
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
            email.toLowerCase().trim(),
            {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${token}`,
            }
        )

        if (resetError) {
            console.error("Error sending reset email:", resetError)
            // Still return success to prevent email enumeration
        }

        return NextResponse.json({
            message: "If an account exists with this email, you will receive a password reset link.",
        })
    } catch (error) {
        console.error("Unexpected error in forgot-password:", error)
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
        )
    }
}
