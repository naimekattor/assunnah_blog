export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export async function generateUniqueSlug(
  title: string,
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>,
  excludePostId?: string,
): Promise<string> {
  let slug = generateSlug(title)
  let attempt = 1

  // Check if slug already exists
  while (true) {
    let query = supabase.from("posts").select("id").eq("slug", slug)

    if (excludePostId) {
      query = query.neq("id", excludePostId)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to check slug uniqueness: ${error.message}`)
    }

    // If no posts exist with this slug, we're good
    if (data && data.length === 0) {
      return slug
    }

    // Add a numeric suffix and try again
    const baseSlugs = slug.split("-")
    const lastPart = baseSlugs[baseSlugs.length - 1]
    const isNumeric = /^\d+$/.test(lastPart)

    if (isNumeric) {
      baseSlugs[baseSlugs.length - 1] = String(attempt + 1)
    } else {
      baseSlugs.push(String(attempt + 1))
    }

    slug = baseSlugs.join("-")
    attempt++
  }
}
