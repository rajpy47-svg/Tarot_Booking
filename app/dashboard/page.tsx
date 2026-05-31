import { supabase } from "@/lib/supabase";
import DashboardClient from "./DashboardClient";

export const revalidate = 0;

export default async function Dashboard() {
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  return <DashboardClient bookings={bookings ?? []} error={error?.message} />;
}
