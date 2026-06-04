"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminActivateButton({ dealerId, currentStatus }) {
  const supabase = createClient();
  const router = useRouter();

  async function activate() {
    const { error } = await supabase
      .from("dealerships")
      .update({
        subscription_status: "active",
        setup_status: "active",
        stock_import_status: "imported"
      })
      .eq("id", dealerId);

    if (error) return alert(error.message);
    router.refresh();
  }

  async function pause() {
    const { error } = await supabase
      .from("dealerships")
      .update({ subscription_status: "paused" })
      .eq("id", dealerId);

    if (error) return alert(error.message);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      {currentStatus !== "active" && <button className="btn" onClick={activate}>Activate</button>}
      {currentStatus === "active" && <button className="btn-secondary" onClick={pause}>Pause</button>}
    </div>
  );
}
