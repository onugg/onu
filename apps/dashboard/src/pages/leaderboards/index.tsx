import RootLayout from "@/components/layouts/primary/rootLayout";
import SidebarMenuOption from "@/components/ui/common/sidebarMenuOption";
import {
  HeartIcon,
  LifebuoyIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React from "react";

type LeaderboardMenuOptions = SidebarMenuOption[];
type LeaderboardProps = {
  children: React.ReactNode;
};

const LeaderboardSidebar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const LeaderboardMenuOptions: LeaderboardMenuOptions = [
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
  ];

  return (
    <div className="flex h-screen min-h-max flex-col bg-neutral-900">
      <div className="relative flex flex-1 ">
        <div className="h-full w-64 border-r border-neutral-600 bg-black/50">
          <div className="mx-4 mt-2 space-y-2">
            {LeaderboardMenuOptions.map((option) => (
              <SidebarMenuOption option={option} key={option.name} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Leaderboards: React.FC<LeaderboardProps> = ({ children }) => {
  return (
    <div>
      <RootLayout>
        <LeaderboardSidebar />
        {children}
      </RootLayout>
    </div>
  );
};

export default Leaderboards;
