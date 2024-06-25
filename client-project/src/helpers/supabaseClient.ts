import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  "https://pprakrwwprhcswonwict.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwcmFrcnd3cHJoY3N3b253aWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzMzkwNTAsImV4cCI6MjAzNDkxNTA1MH0.WtciQZUy95YjzcXLnoQUoldCs_USMt95sn4pbXeytJU"
);
