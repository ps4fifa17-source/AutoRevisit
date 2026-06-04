import Link from "next/link";
import { Lock } from "lucide-react";

export default function LockedFeature({ title, description, requiredPlan = "Pro", children }) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-ink/10 bg-white/70 p-6">
      <div className="absolute inset-0 backdrop-blur-[1px] bg-white/50" />
      <div className="relative">
        <div className="h-12 w-12 rounded-3xl bg-ink text-acid flex items-center justify-center">
          <Lock size={20} />
        </div>
        <h3 className="text-2xl font-black mt-5">{title}</h3>
        <p className="text-ink/55 mt-2">{description}</p>
        {children}
        <Link href="/dashboard/upgrade" className="btn-acid mt-5">
          Unlock with {requiredPlan}
        </Link>
      </div>
    </div>
  );
}
