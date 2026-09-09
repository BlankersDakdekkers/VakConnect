const publicKeys = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const;

export function isSupabaseConfigured() {
  return publicKeys.every((key) => Boolean(process.env[key]));
}

export function getRequiredEnv(key: string) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}
