import LoginShell from "@/components/LoginShell";
import LoginForm from "@/components/LoginForm";

export default function AdminLoginPage() {
  return (
    <LoginShell>
      <LoginForm role="admin" />
    </LoginShell>
  );
}
