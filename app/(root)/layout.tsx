import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.actions";
import LogoutButton from "@/components/ui/LogoutButton";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
  {/* Navigation bar with logo left, logout button right */}
  <nav className="flex justify-between items-center px-6 py-4">
    <Link href="/" className="flex items-center gap-2">
      <Image src="/logo.svg" alt="MockMate Logo" width={58} height={32} />
      <h2 className="text-primary-100 text-3xl font-semibold">PrepWise</h2>
    </Link>
    
    <LogoutButton />
  </nav>

  {/* Page content */}
  <main className="px-6 py-4">
    {children}
  </main>
</div>

  );
};

export default Layout;