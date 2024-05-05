import {createBrowserClient} from "@supabase/ssr"
const url = process.env.NEXT_PUBLIC_SUPABASE_URL! as string;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! as string;

export const supabase = createBrowserClient(url, key);