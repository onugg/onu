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

const LeaderboardSidebar: React.FC = () => {
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
    <div className="h-full w-64 border-r border-neutral-600 bg-black/50">
      <div className="mx-4 mt-2 space-y-2">
        <Link className="group my-1 flex flex-col" href={"/leaderboards"}>
          <div
            className={`font-small w-full rounded-t-lg border-x-2 border-t-2 border-black bg-neutral-900 px-3 py-6 text-sm font-bold
            transition duration-200 hover:text-white ${
              currentPath === "/leaderboards"
                ? `bg-indigo-500/20 text-white`
                : `text-neutral-400`
            }`}
          >
            <div className="flex flex-row items-center gap-3 align-baseline">
              <TrophyIcon
                className={`h-5 w-5 group-hover:text-indigo-400 ${
                  currentPath === "/leaderboards" ? `text-indigo-400` : ``
                }`}
              />
              Leaderboard
            </div>
          </div>
          <div
            className={`flex items-center justify-between w-full rounded-b-lg border-x-2 border-b-2 border-black bg-neutral-900 py-2 px-3 text-sm font-medium text-neutral-400
          ${
            currentPath === "/leaderboards"
              ? `bg-indigo-400/20 text-white`
              : `text-neutral-400`
          }`}
          >
          <p>
            Current Rank
            </p> 
            <p className="px-3 py-1 bg-yellow-400/40 text-yellow-400 rounded-md">
                {/* To do Add Rank Data */}
                1st
            </p>
          </div>
        </Link>

        {LeaderboardMenuOptions.map((section) => (
          <div key={section.title}>
            <p className="mx-1 mb-1 py-1 pt-2 text-xs font-semibold uppercase text-neutral-600">
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

const LeaderboardLayout: React.FC<LeaderboardProps> = ({ children }) => {
  return (
    <div className="flex h-screen min-h-max flex-col bg-neutral-900">
      <RootLayout>
        <div className="relative flex flex-1">
          <LeaderboardSidebar />
          {children}
        </div>
      </RootLayout>
    </div>
  );
};

export default LeaderboardLayout;
