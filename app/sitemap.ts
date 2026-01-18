import { MetadataRoute } from 'next'
import { createStaticClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createStaticClient()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Fetch all published posts
    const { data: posts } = await supabase
        .from("posts")
        .select("slug, updated_at")
        .eq("status", "published")

    const postEntries: MetadataRoute.Sitemap = (posts || []).map((post) => ({
        url: `${baseUrl}/post/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/blogs`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        ...postEntries,
    ]
}
