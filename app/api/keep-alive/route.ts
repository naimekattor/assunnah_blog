import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // or anon key
);

export async function GET() {
  await supabase.from("posts").select("id").limit(1);
  return Response.json({ ok: true });
}