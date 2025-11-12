"use client";

import Logo from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/auth-context";
import Link from "next/link";
import React from "react";

const Header = () => {
  const { currentUser } = useAuthContext();

  return (
    <header className="flex items-center justify-between py-4">
      <Link href="/">
        <Logo />
      </Link>

      {currentUser ? (
        <div>
          <span className="font-medium underline text-sm">
            {currentUser.fullname} ({currentUser.role})
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary">
            <Link href="/signin">Signin</Link>
          </Button>
          {/* <Button asChild>
            <Link href="/signup">Register</Link>
          </Button> */}
        </div>
      )}
    </header>
  );
};

export default Header;
