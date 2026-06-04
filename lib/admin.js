export function isAdminProfile(profile) {
  return profile?.role === "admin";
}

export async function getAdminContext(supabase) {
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return { user: null, profile: null, isAdmin: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .single();

  return {
    user: auth.user,
    profile,
    isAdmin: isAdminProfile(profile),
  };
}
