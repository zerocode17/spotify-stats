import React from "react";
import { Button } from "./ui/button";
import ThemeToggle from "./theme-toggle";
import Link from "next/link";
import { validateRequest } from "@/lib/auth";
import { logout } from "@/lib/actions";

export default async function MainNav() {
  const { user } = await validateRequest();

  return (
    <nav className="mx-auto max-w-[1300px] px-2 lg:px-0">
      <div className="flex w-full justify-between py-6">
        <Link href={"/"}>
          <h1 className="text-2xl font-bold">Spotify Stats</h1>
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center">
              <p>Stats for: {user.username}</p>
              <form action={logout}>
                <Button type="submit" variant={"link"}>
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <Button
              className="hidden rounded-2xl font-semibold md:block"
              asChild
            >
              <Link href={"/login/spotify"}>Connect with Spotify</Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
