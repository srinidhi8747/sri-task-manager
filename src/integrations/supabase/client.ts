// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yoezdxizykcphgiqrmns.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvZXpkeGl6eWtjcGhnaXFybW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NzM4NTUsImV4cCI6MjA2MTA0OTg1NX0.-ZD_7lUZ-nxOETDNqU8etRludRO-WxD8ytIN3QLRsMQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);