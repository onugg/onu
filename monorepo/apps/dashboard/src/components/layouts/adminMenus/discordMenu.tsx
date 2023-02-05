import React from "react";
import type { MenuSection } from "@/types";
import {
  Square2StackIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  MapIcon,
  PuzzlePieceIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import SidebarMenuOption from "@/components/ui/common/sidebarMenuOption";

type DiscordAdminMenuOptions = MenuSection[];

const DiscordMenu: React.FC = () => {

    const router = useRouter();
    const slug = router.query.slug as string;
    const currentPath = router.pathname;

    const DiscordAdminMenuOptions: DiscordAdminMenuOptions = [
        {
          title: "Server Management",
          options: [
            {
              name: "Overview",
              href: `/c/${slug}/admin/discord/overview`,
              icon: Square2StackIcon,
              current: (currentPath === `/c/[slug]/admin/discord/overview`),
            },
            {
              name: "General",
              href: `/c/${slug}/admin/discord/general`,
              icon: Cog6ToothIcon,
              current: currentPath === `/c/[slug]/admin/discord/general`,
            },
            {
              name: "Moderation",
              href: `/c/${slug}/admin/discord/moderation`,
              icon: UserGroupIcon,
              current: currentPath === `/c/[slug]/admin/discord/moderation`,
            },
            {
              name: "Quests",
              href: `/c/${slug}/admin/discord/quests`,
              icon: MapIcon,
              current: currentPath === `/c/[slug]/admin/discord/quests`,
            },
            {
              name: "Minigames",
              href: `/c/${slug}/admin/discord/minigames`,
              icon: PuzzlePieceIcon,
              current: currentPath === `/c/[slug]/admin/discord/minigames`,
            },
            {
              name: "Analytics",
              href: `/c/${slug}/admin/discord/analytics`,
              icon: PresentationChartBarIcon,
              current: currentPath === `/c/[slug]/admin/discord/analytics`,
            },
          ],
        },
        {
          title: "Miscellaneous",
          options: [
            {
              name: "Overview",
              href: `/c/${slug}/admin/discord/overview`,
              icon: Square2StackIcon,
              current: currentPath === `/c/[slug]/admin/discord/analytics`,
            },
          ],
        },
      ];

  return (
    <div className="h-full w-64 border-r border-neutral-600 bg-black/50">
      <div className="mx-4 mt-2 space-y-2">
        {DiscordAdminMenuOptions.map((section) => (
          <div key={section.title}>
            <p className="mx-1 mb-1 pt-2 py-1 text-xs font-semibold uppercase text-neutral-600">
              {section.title}
            </p>
            {section.options.map((option) => (
              <SidebarMenuOption option={option} key={option.name}/>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscordMenu;
