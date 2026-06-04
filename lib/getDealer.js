import { createClient } from "@/lib/supabase/server";

export async function getDealerContext() {
  const supabase = createClient();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return { supabase, user: null, profile: null, dealer: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, dealerships(*)")
    .eq("id", auth.user.id)
    .single();

  return {
    supabase,
    user: auth.user,
    profile,
    dealer: profile?.dealerships || null
  };
}
