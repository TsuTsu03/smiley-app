import Link from "next/link";
import { UserCog, Stethoscope, SmilePlus, ChevronRight } from "lucide-react";
import LoginShell from "@/components/LoginShell";

const OPTIONS = [
  { href: "/login/admin", label: "Admin", desc: "Manage your whole clinic", icon: UserCog, color: "from-sky-600 to-sky-500" },
  { href: "/login/dentist", label: "Dentist", desc: "Your schedule & patient records", icon: Stethoscope, color: "from-sky-500 to-teal-500" },
  { href: "/login/patient", label: "Patient", desc: "Book & view your appointments", icon: SmilePlus, color: "from-teal-500 to-teal-400" },
];

export default function LoginChooserPage() {
  return (
    <LoginShell>
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-7 w-full max-w-md">
        <h2 className="text-lg font-display font-semibold text-sky-900 mb-1">How do you want to sign in?</h2>
        <p className="text-sm text-sky-400 mb-6">Choose your role to continue.</p>

        <div className="space-y-3">
          {OPTIONS.map(({ href, label, desc, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 rounded-2xl border border-sky-100 bg-sky-50/30 p-4 hover:border-sky-300 hover:bg-white hover:shadow-md transition-all"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md shrink-0`}>
                <Icon size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sky-900 text-sm">{label}</div>
                <div className="text-xs text-sky-400">{desc}</div>
              </div>
              <ChevronRight size={18} className="text-sky-300 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </LoginShell>
  );
}
