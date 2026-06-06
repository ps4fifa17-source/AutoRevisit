"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BRAND } from "@/lib/brand";
import {
  LayoutDashboard,
  Car,
  FileStack,
  BarChart3,
  Settings,
  Plus,
  Send,
  Users,
  Crown,
  ShieldCheck,
} from "lucide-react";

const LOGO_SRC = "/logo.png";

const baseItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true, group: "Home" },
  { href: "/dashboard/vehicles", label: "Vehicles", icon: Car, exact: true, group: "Stock" },
  { href: "/dashboard/vehicles/new", label: "Add vehicle", icon: Plus, exact: true, group: "Stock" },
  { href: "/dashboard/pages/new", label: "Create page", icon: Send, exact: false, group: "Customer journey" },
  { href: "/dashboard/live-pages", label: "Live pages", icon: FileStack, exact: false, group: "Customer journey" },
  { href: "/dashboard/leads", label: "Leads", icon: Users, exact: false, group: "Customer journey" },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, exact: false, group: "Business" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, exact: false, group: "Business" },
  { href: "/dashboard/upgrade", label: "Upgrade", icon: Crown, exact: false, group: "Business" },
];

const adminItem = { href: "/dashboard/admin", label: "Admin", icon: ShieldCheck, exact: false, group: "Admin" };

function isActive(pathname, item) {
  if (!pathname) return false;
  if (item.href === "/dashboard/vehicles") return pathname === "/dashboard/vehicles";
  if (item.href === "/dashboard/vehicles/new") return pathname === "/dashboard/vehicles/new";
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export default function DashboardNav() {
  const pathname = usePathname();
  const supabase = createClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function run() {
      const { data: auth } = await supabase.auth.getUser();

      if (!auth.user) {
        setLoaded(true);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", auth.user.id)
        .single();

      setIsAdmin(profile?.role === "admin");
      setLoaded(true);
    }

    run();
  }, [supabase]);

  const items = isAdmin ? [...baseItems, adminItem] : baseItems;
  let lastGroup = "";

  return (
    <aside className="sticky top-0 z-40 -mx-4 mb-4 rounded-none border-x-0 border-t-0 bg-[#fffdf8]/92 p-2 shadow-sm backdrop-blur-xl md:card md:mx-0 md:mb-0 md:p-4 md:top-0 md:h-screen md:overflow-y-auto">
      <div className="hidden md:flex items-center gap-3 px-3 py-3 mb-3">
        <div className="h-12 w-12 flex items-center justify-center shrink-0">
          <img
            src={LOGO_SRC}
            alt={`${BRAND.name} logo`}
            className="h-11 w-11 object-contain"
          />
        </div>

        <div>
          <p className="font-black leading-none">{BRAND.name}</p>
          <p className="text-xs text-ink/45 mt-1">Journey workspace</p>
        </div>
      </div>

      <div className="flex md:block gap-2 overflow-x-auto overscroll-x-contain md:overflow-visible pb-1 md:pb-0 [-ms-overflow-style:none] [scrollbar-width:none]">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item);
          const showGroup = item.group !== lastGroup;
          lastGroup = item.group;

          return (
            <div key={item.href}>
              {showGroup && (
                <p className="hidden md:block px-4 mt-4 mb-2 text-[10px] uppercase tracking-[0.22em] font-black text-ink/35">
                  {item.group}
                </p>
              )}

              <Link
                href={item.href}
                className={`relative flex shrink-0 items-center justify-center md:justify-start gap-2 md:gap-3 rounded-2xl transition whitespace-nowrap font-black px-3 py-2.5 md:px-4 md:py-3 text-xs md:text-base ${
                  active ? "bg-ink text-acid shadow-lg" : "hover:bg-ink/6 text-ink"
                }`}
              >
                {active && (
                  <span className="absolute bottom-0 left-1/2 h-1 w-7 -translate-x-1/2 rounded-full bg-acid md:bottom-auto md:left-1 md:top-1/2 md:h-7 md:w-1 md:-translate-x-0 md:-translate-y-1/2" />
                )}
                <Icon size={17} />
                <span className="hidden sm:inline md:inline">{item.label}</span>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="hidden md:block mt-5 rounded-3xl bg-ink/5 p-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-ink/35">Current page</p>
        <p className="font-black mt-1">{items.find((item) => isActive(pathname, item))?.label || "Workspace"}</p>
        {loaded && isAdmin && <p className="text-xs font-black text-acid mt-2">Admin mode enabled</p>}
      </div>
    </aside>
  );
}