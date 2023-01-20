import RootLayout from "@/components/layouts/primary/rootLayout";
import SidebarMenuOption from "@/components/ui/common/sidebarMenuOption";
import type { MenuSection } from "@/types";
import Link from "next/link";
import {
  HeartIcon,
  LifebuoyIcon,
  MegaphoneIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React from "react";

type LeaderboardMenuOptions = MenuSection[];
type LeaderboardProps = {
  children: React.ReactNode;
};

const LeaderboardLeftSidebar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const LeaderboardMenuOptions: LeaderboardMenuOptions = [
    {
      title: "Other Leaderboards",
      options: [
        {
          name: "Chatters",
          href: `/leaderboards/chatters`,
          icon: MegaphoneIcon,
          current: currentPath === `/leaderboards/chatters`,
        },
        {
          name: "Helpers",
          href: `/leaderboards/helpers`,
          icon: LifebuoyIcon,
          current: currentPath === `/leaderboards/helpers`,
        },
        {
          name: "Lovers",
          href: `/leaderboards/lovers`,
          icon: HeartIcon,
          current: currentPath === `/leaderboards/lovers`,
        },
      ],
    },
  ];

  return (
    <div className="relative h-full w-64 shrink-0 border-neutral-600 bg-theme-900">
      <div className="mx-4 mt-2 space-y-2">
        <Link className="group my-1 flex flex-col" href={"/leaderboards"}>
          <div
            className={`font-small w-full rounded-t-lg bg-theme-800 px-3 py-6 text-sm font-bold
            transition duration-300 hover:text-white border-x-2 border-t-2 text-white group-hover:border-violet-500 ${
              currentPath === "/leaderboards"
                ? ` border-violet-700 `
                : `text-theme-200 border-theme-800`
            }`}
          >
            <div className="flex flex-row items-center gap-3 align-baseline">
              <TrophyIcon
                className={`h-5 w-5 ${
                  currentPath === "/leaderboards" ? `text-violet-400` : ``
                }`}
              />
              Leaderboard
            </div>
          </div>
          <div
            className={`flex duration-300 w-full items-center justify-between rounded-b-lg border-x-2 border-b-2 group-hover:border-violet-500 bg-theme-900 py-2 px-3 text-sm font-medium text-theme-100
          ${
            currentPath === "/leaderboards"
              ? `border-violet-700`
              : `text-theme-200 border-theme-800`
          }`}
          >
            <p>Current Rank</p>
            <p className="rounded-md bg-yellow-400/40 px-3 py-1 text-yellow-400">
              {/* To do Add Rank Data */}
              1st
            </p>
          </div>
        </Link>

        {LeaderboardMenuOptions.map((section) => (
          <div key={section.title}>
            <p className="mx-1 mb-1 py-1 pt-2 text-xs font-semibold uppercase text-theme-700">
              {section.title}
            </p>
            {section.options.map((option) => (
              <SidebarMenuOption option={option} key={option.name} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const LeaderboardRightSidebar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const LeaderboardMenuOptions: LeaderboardMenuOptions = [
    {
      title: "Other Leaderboards",
      options: [
        {
          name: "Chatters",
          href: `/leaderboards/chatters`,
          icon: MegaphoneIcon,
          current: currentPath === `/leaderboards/chatters`,
        },
        {
          name: "Helpers",
          href: `/leaderboards/helpers`,
          icon: LifebuoyIcon,
          current: currentPath === `/leaderboards/helpers`,
        },
        {
          name: "Lovers",
          href: `/leaderboards/lovers`,
          icon: HeartIcon,
          current: currentPath === `/leaderboards/lovers`,
        },
      ],
    },
  ];

  return (
    <div className="relative h-full w-64 shrink-0 border-neutral-600 bg-theme-900 justify-self-end">
      <div className="mx-4 mt-2 space-y-2">

      </div>
    </div>
  );
};

const LeaderboardLayout: React.FC<LeaderboardProps> = ({ children }) => {
  return (
    <div className="flex h-screen min-h-max flex-col">
      <RootLayout>
        <div className="relative flex flex-1">
          <LeaderboardLeftSidebar />
          {children}
          <LeaderboardRightSidebar />
        </div>
      </RootLayout>
    </div>
  );
};

export default LeaderboardLayout;
