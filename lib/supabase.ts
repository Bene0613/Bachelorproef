import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mditokycgnfyrsmxhokq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_U5gcr6TbmvoVweNHwiQPdQ_57WY-KqO";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);