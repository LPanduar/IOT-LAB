import { auth } from "@/auth";
import LogoutButton from "@/components/logout-button";
import DashboardContent from "../../../components/dashboard-content";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
      <DashboardContent />
  );
}
