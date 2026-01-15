import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            )
        }

        const apiKey = process.env.IMGBB_API_KEY

        // If no API key, returns error instructing user to add it
        if (!apiKey) {
            return NextResponse.json(
                {
                    error: "Configuration Error: IMGBB_API_KEY is missing in environment variables. Please add it to your .env.local file."
                },
                { status: 500 }
            )
        }

        // Prepare form data for ImgBB
        const imgbbFormData = new FormData()
        imgbbFormData.append("image", file)
        imgbbFormData.append("key", apiKey)

        // Upload to ImgBB
        const response = await fetch("https://api.imgbb.com/1/upload", {
            method: "POST",
            body: imgbbFormData,
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
            console.error("ImgBB Upload Error:", data)
            return NextResponse.json(
                { error: data.error?.message || "Failed to upload image to ImgBB" },
                { status: response.status || 500 }
            )
        }

        // Return the display URL (or data.data.url for direct link)
        return NextResponse.json({
            url: data.data.url,
            delete_url: data.data.delete_url
        })

    } catch (error) {
        console.error("Upload handler error:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
