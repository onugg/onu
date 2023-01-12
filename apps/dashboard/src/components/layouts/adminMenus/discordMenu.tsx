import React from "react";
import type { AdminMenuSection } from "@/types";
import {
  Square2StackIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  MapIcon,
  PuzzlePieceIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";

type DiscordAdminMenuOptions = AdminMenuSection[];

const DiscordMenu: React.FC = () => {

    const router = useRouter();
    const slug = router.query.slug as string;

    const DiscordAdminMenuOptions: DiscordAdminMenuOptions = [
        {
          title: "",
          options: [
            {
              name: "Overview",
              href: `/c/${slug}/admin/discord/overview`,
              icon: Square2StackIcon,
              current: true,
            },
            {
              name: "General",
              href: `/c/${slug}/admin/discord/general`,
              icon: Cog6ToothIcon,
              current: false,
            },
            {
              name: "Moderation",
              href: `/c/${slug}/admin/discord/moderation`,
              icon: UserGroupIcon,
              current: false,
            },
            {
              name: "Quests",
              href: `/c/${slug}/admin/discord/quests`,
              icon: MapIcon,
              current: false,
            },
            {
              name: "Minigames",
              href: `/c/${slug}/admin/discord/minigames`,
              icon: PuzzlePieceIcon,
              current: false,
            },
            {
              name: "Statistics",
              href: `/c/${slug}/admin/discord/statistics`,
              icon: PresentationChartBarIcon,
              current: false,
            },
          ],
        },
        {
          title: "Server Management",
          options: [
            {
              name: "Overview",
              href: `/c/${slug}/admin/discord/overview`,
              icon: Square2StackIcon,
              current: false,
            },
          ],
        },
      ];

  return (
    <div className="h-full w-64 border-r border-neutral-600 bg-black/50">
      <div className="mx-4 mt-2 space-y-2">
        {DiscordAdminMenuOptions.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 py-1 text-xs font-semibold uppercase text-white">
              {section.title}
            </p>
            {section.options.map((option) => (
              <Link className="flex flex-col" key={option.name} href={option.href}>
                <div
                  className={`font-small w-full rounded-md px-3 py-2 text-sm
                    transition duration-200 hover:text-white ${
                      option.current
                        ? `bg-neutral-800 text-neutral-200`
                        : `text-neutral-400`
                    }`}
                >
                  <div className="flex flex-row items-center gap-3 align-baseline">
                    <option.icon className="h-5 w-5" />
                    {option.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscordMenu;
