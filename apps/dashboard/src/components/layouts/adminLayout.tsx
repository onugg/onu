import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import RootLayout from "./rootLayout";
import { trpc } from "../../utils/trpc";
import { Square2StackIcon, Cog6ToothIcon, UserGroupIcon, MapIcon, PuzzlePieceIcon, PresentationChartBarIcon } from "@heroicons/react/24/outline";
import type { AdminMenuSection } from "../../types";

type AdminMenuOptions = AdminMenuSection[];

const PlusIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1"
      stroke="currentColor"
      className="aspect-square w-1/2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
};

const plugins = [
  {
    name: "Discord",
    color: "bg-discord",
  },
  {
    name: "Youtube",
    color: "bg-red-500",
  },
];

// list of adminMenuOptions

const AdminMenuOptions: AdminMenuOptions = [
  {
    title: "",
    options: [
      {
        name: "Overview",
        href: "/communities/[slug]/admin/discord/overview",
        icon: Square2StackIcon,
        current: true,
      },
      {
        name: "General",
        href: "/communities/[slug]/admin/discord/general",
        icon: Cog6ToothIcon,
        current: false,
      },
      {
        name: "Moderation",
        href: "/communities/[slug]/admin/discord/moderation",
        icon: UserGroupIcon,
        current: false,
      },
      {
        name: "Quests",
        href: "/communities/[slug]/admin/discord/quests",
        icon: MapIcon,
        current: false,
      },
      {
        name: "Minigames",
        href: "/communities/[slug]/admin/discord/minigames",
        icon: PuzzlePieceIcon,
        current: false,
      },
      {
        name: "Statistics",
        href: "/communities/[slug]/admin/discord/statistics",
        icon: PresentationChartBarIcon,
        current: false,
      },
    ]
  },
  {
    title: "Server Management",
    options: [
      {
        name: "Overview",
        href: "/communities/[slug]/admin/discord/overview",
        icon: Square2StackIcon,
        current: false,
      },
    ]
  }
];

const PluginSidebar: React.FC = () => {
  return (
    // Sidebar
    <div className="h-full w-24 space-y-6 border-r border-neutral-600 bg-black">
      {plugins.map((plugin) => (
        <div className={`mt-6 flex w-full justify-center `} key={plugin.name}>
          <div
            className={`aspect-square w-3/5 rounded-xl border border-neutral-600 ${plugin.color} duration-200 hover:scale-110`}
          ></div>
        </div>
      ))}
      <div className="flex w-full justify-center">
        <div className="flex aspect-square w-3/5 place-items-center rounded-xl border border-neutral-600 bg-neutral-900 duration-200 hover:scale-110">
          <div className="flex justify-center">
            <PlusIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuSidebar: React.FC = () => {
  return (
    <div className="h-full w-64 border-r border-neutral-600 bg-black/50">
      <div className="mx-4 mt-2 space-y-2">
        {AdminMenuOptions.map((section) => (
          <div key={section.title}>
            <h4 className="px-3 py-1 text-white font-semibold uppercase text-xs mb-2">{section.title}</h4>
            {section.options.map((option) => (
              <div className="flex flex-col" key={option.name}>
                <div
                  className={`hover:text-white font-small w-full rounded-md px-3 py-2
                  text-sm transition duration-200 ${option.current ? `text-neutral-200 bg-neutral-800`: `text-neutral-400`}`}
                >
                  <div className="flex flex-row gap-3 items-center align-baseline">
                  <option.icon className="h-5 w-5" />
                  {option.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};


const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const session = useSession();
  const slug = router.query.slug as string;
  const community = trpc.community.getCommunityBySlug.useQuery({
    slug: slug,
  });
  const user = trpc.user.getUserBySession.useQuery();
  const communityId = community?.data?.id;
  const userId = user?.data?.id;

  // To do: Make this typesafe
  const member = trpc.member.getMemberByCommunityIdAndUserId.useQuery(
    {
      communityId: communityId as string,
      userId: userId as string,
    },
    {
      enabled: !!(communityId && userId),
    }
  );

  const memberData = member?.data;
  useEffect(() => {
    // To do: Research if there is a cleaner way of doing this routing
    if (session.status === "authenticated") {
      if (memberData?.role === "owner" || "admin") {
        return;
      } else {
        router.push("/communities");
      }
    } else if (session.status === "unauthenticated") {
      router.push("/auth/signin");
    }
  });

  return (
    <div className="flex h-screen min-h-max flex-col bg-neutral-900">
      <RootLayout>
        <div className="relative flex flex-1">
          <PluginSidebar />
          <MenuSidebar />
          {children}
        </div>
      </RootLayout>
    </div>
  );
};

export default AdminLayout;
