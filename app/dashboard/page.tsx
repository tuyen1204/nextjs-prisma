import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main className="max-w-md h-screen flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-white">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome, {session.user?.name || "User"}!</p>
      <p>Email: {session.user?.email}</p>
      
      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <button
          type="submit"
          className="w-full bg-white text-black font-medium rounded-md px-4 py-2 hover:bg-gray-200"
        >
          Sign Out
        </button>
      </form>
    </main>
  );
}
