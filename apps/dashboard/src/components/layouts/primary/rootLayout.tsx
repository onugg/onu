import { BellIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import LogoLight from "@/assets/OnuLogoLight.svg";
import { trpc } from "@/utils/trpc";

const PrimaryNavigation = [
  { name: "Support", href: "#" },
  { name: "News", href: "#" },
  { name: "Docs", href: "#" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Scroll Bar Progress
export function useReadingProgress() {
  const [completion, setCompletion] = useState(0);
  useEffect(() => {
    function updateScrollCompletion() {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;

      if (scrollHeight) {
        setCompletion(
          Number((currentProgress / scrollHeight).toFixed(2)) * 100
        );
      }
    }

    window.addEventListener("scroll", updateScrollCompletion);

    return () => {
      window.removeEventListener("scroll", updateScrollCompletion);
    };
  }, []);

  return completion;
}

const PrimaryNavbar: React.FC = () => {
  const { data: user } = trpc.user.getUserBySession.useQuery();
  const profileImage = user?.image as string;

  return (
    <div className="relative z-40 h-12 scroll-smooth bg-theme-900">
      <div className="flex items-center justify-between px-6 ">
        <Image src={LogoLight} alt="Logo" className="my-3 w-28" />
        <div className="font-sm mx-4 hidden flex-row items-center py-2 text-theme-200 md:flex">
          <Link
            key="feedback"
            href="/"
            className="rounded-md border border-theme-700 px-3 py-2 text-sm hover:border-neutral-100"
          >
            Feedback
          </Link>

          {PrimaryNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm hover:text-neutral-100"
            >
              {item.name}
            </Link>
          ))}
          <BellIcon className="mx-2 w-8 cursor-pointer rounded-full border border-neutral-700 p-1 hover:text-neutral-100 " />
          <button className="mx-2 cursor-pointer">
            <Image
              src={profileImage}
              alt="Profile"
              className="rounded-full border border-neutral-700"
              width="36"
              height="36"
            />
          </button>
        </div>
      </div>
      <div className=""></div>
    </div>
  );
};

const SubNavbar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  const pathStart = currentPath.split("/")[1];

  const SubNavigation = [
    { name: "Communities", href: "/communities", current: (currentPath === "/communities") || (pathStart === "c") },
    { name: "Trending", href: "/trending", current: currentPath === "/trending"},
    { name: "Leaderboards", href: "/leaderboards", current: currentPath === "/leaderboards"},
    { name: "Profile", href: "/profile", current: currentPath === "/profile"},
    { name: "Activity", href: "/activity", current: currentPath === "/activity"},
    { name: "Settings", href: "/settings", current: currentPath === "/settings"},
  ];
  const completion = useReadingProgress();
  return (
    <div className="sticky top-0 z-40 bg-theme-900">
      <div className="flex items-center justify-between border-b-2 border-violet-700 px-4 sm:px-0">
        <span
          id="progress-bar"
          style={{
            transform: `translateX(${completion - 100}%)`,
          }}
          className={`absolute bottom-0 h-0.5 w-full bg-blue-500 transition-transform`}
        />
        <div className="mx-4 flex items-baseline py-2">
          {SubNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? "text-white "
                  : "text-theme-200 transition duration-200 hover:bg-theme-800 hover:text-white",
                "font-small rounded-md px-3 py-2 text-sm"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/auth/signin");
    }
  });
  return (
    <div className="flex min-h-screen flex-col bg-theme-900  ">
      <PrimaryNavbar />
      <SubNavbar />
      {children}
    </div>
  );
};

export default RootLayout;
