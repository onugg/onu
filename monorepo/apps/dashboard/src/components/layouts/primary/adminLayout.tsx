import React, { useEffect } from "react";

import DiscordLogo from "@/assets/discord-mark-white.svg";
import Image from "next/image";
import Link from "next/link";
import RootLayout from "./rootLayout";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

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

const PluginSidebar: React.FC = () => {
  const router = useRouter();
  const slug = router.query.slug as string;
  const community = trpc.discord.getDiscordBySlug.useQuery({
    slug: slug,
  });
  return (
    // Sidebar
    <div className="h-full w-24 space-y-6 border-r border-neutral-600 bg-gray-900">
      <Link
        className={`mt-6 flex w-full justify-center`}
        key={community.data?.discordGuild?.discordId}
        href={`/c/${slug}/admin/discord/overview`}
      >
        <div
          className={`relative flex aspect-square w-3/5 place-items-center justify-center rounded-xl border border-neutral-600 bg-discord duration-200 hover:scale-110`}
        >
          <Image src={DiscordLogo} alt="Discord Logo" className=" w-8" />
        </div>
      </Link>

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
    <div className="flex h-screen min-h-max flex-col">
      <RootLayout>
        <div className="relative flex flex-1">
          <PluginSidebar />
          {children}
        </div>
      </RootLayout>
    </div>
  );
};

export default AdminLayout;
