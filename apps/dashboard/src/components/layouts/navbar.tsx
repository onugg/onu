import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { BellIcon } from "@heroicons/react/24/outline";
import LogoLight from "../../assets/OnuLogoLight.svg";

const PrimaryNavigation = [
  { name: "Support", href: "#" },
  { name: "News", href: "#" },
  { name: "Docs", href: "#" },
];

const SubNavigation = [
  { name: "Communities", href: "/communities", current: true },
  { name: "Trending", href: "#", current: false },
  { name: "Profile", href: "#", current: false },
  { name: "Activity", href: "#", current: false },
  { name: "Settings", href: "#", current: false },
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
    <div className="relative h-12 bg-black scroll-smooth z-40">
      <div className="flex items-center justify-between px-6 ">
        <Image src={LogoLight} alt="Logo" className="my-3 w-28" />
        <div className="hidden md:flex font-sm mx-4 flex-row items-center py-2 text-neutral-400">
          <Link
            key="feedback"
            href="/"
            className="rounded-md border border-neutral-700 px-3 py-2 text-sm hover:border-neutral-100"
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
  const completion = useReadingProgress();
  return (
    <div className="z-40 sticky top-0 bg-black">
      <div className="flex items-center justify-between px-4 sm:px-0 border-b border-neutral-700">
        <span
          id="progress-bar"
          style={{
            transform: `translateX(${completion - 100}%)`,
          }}
          className={`absolute bottom-0 h-0.5 w-full bg-accent transition-transform`}
        />
        <div className="mx-4 flex items-baseline py-2">
          {SubNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? "text-white "
                  : "text-neutral-400 transition duration-200 hover:bg-neutral-800 hover:text-white",
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

const Navbar: React.FC = () => {
  return (
    <>
        <PrimaryNavbar />
        <SubNavbar />
    </>
  );
}

export default Navbar;
