import {
  Cog6ToothIcon,
  MapIcon,
  PresentationChartBarIcon,
  PuzzlePieceIcon,
  SignalIcon,
  Square2StackIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import React from "react";
import SidebarMenuOption from "@/components/ui/common/sidebarMenuOption";
import { discordGuild } from "@onu/api/src/router/sessionProtectedRoutes/discord";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { z } from "zod";

const MenuSection = z.object({
  name: z.string(),
  href: z.string(),
  icon: z.any(),
  current: z.boolean(),
});

type MenuSection = z.infer<typeof MenuSection>;
type DiscordAdminMenuOptions = MenuSection[];

const DiscordMenu: React.FC = () => {
  const router = useRouter();

  const slug = router.query.slug as string;

  const currentPath = router.pathname;

  const community = trpc.discord.getDiscordBySlug.useQuery({ slug: slug });

  const DiscordGuild = trpc.discord.getDiscordGuildFromDiscordAPI.useQuery({
    guildId: community.data?.discordGuild?.discordId,
  });

  const DiscordAdminMenuOptions: DiscordAdminMenuOptions = [
    {
      name: "Overview",
      href: `/c/${slug}/admin/discord/overview`,
      icon: Square2StackIcon,
      current: currentPath === `/c/[slug]/admin/discord/overview`,
    },
    {
      name: "Analytics",
      href: `/c/${slug}/admin/discord/analytics`,
      icon: PresentationChartBarIcon,
      current: currentPath === `/c/[slug]/admin/discord/analytics`,
    },
    {
      name: "Activity",
      href: `/c/${slug}/admin/discord/minigames`,
      icon: SignalIcon,
      current: currentPath === `/c/[slug]/admin/discord/minigames`,
    },
    {
      name: "Settings",
      href: `/c/${slug}/admin/discord/general`,
      icon: Cog6ToothIcon,
      current: currentPath === `/c/[slug]/admin/discord/general`,
    },
  ];
    return (
      <div className="h-full w-60 bg-gray-900">
        <div
          className="m-4 aspect-square bg-cover bg-center"
          style={{
            backgroundImage: `url(${  })`,
          }}
        >

        </div>
        <div className="mx-3 mt-6">
          {DiscordAdminMenuOptions.map((option) => (
            <SidebarMenuOption option={option} key={option.name} />
          ))}
        </div>
      </div>
    );
};

export default DiscordMenu;
