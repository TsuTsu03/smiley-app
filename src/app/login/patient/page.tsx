import LoginShell from "@/components/LoginShell";
import LoginForm from "@/components/LoginForm";

export default function PatientLoginPage() {
  return (
    <LoginShell>
      <LoginForm role="patient" />
    </LoginShell>
  );
}
