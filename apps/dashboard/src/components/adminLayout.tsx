import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import RootLayout from "../components/rootLayout";
import { trpc } from "../utils/trpc";

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

const PluginSidebar: React.FC = () => {
  return (
    // Sidebar
    <div>
      <div className="min-h-screen w-24 overflow-y-scroll border-r border-neutral-600 bg-black">
        <div className="relative flex flex-col">
          {plugins.map((plugin) => (
            <div
              className={`mt-6 flex w-full justify-center `}
              key={plugin.name}
            >
              <div
                className={`aspect-square w-3/5 rounded-xl border border-neutral-600 ${plugin.color} duration-200 hover:scale-110`}
              ></div>
            </div>
          ))}
          <div className="mt-6 flex w-full justify-center">
            <div className="flex aspect-square w-3/5 place-items-center rounded-xl border border-neutral-600 bg-neutral-900 duration-200 hover:scale-110">
              <div className="flex justify-center">
                <PlusIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuSidebar: React.FC = () => {
    return (
      <div className="w-64 min-h-screen border-r border-neutral-600 bg-black/50">
        <div>
          
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
    <RootLayout>
      <div className="relative flex">
        <PluginSidebar />
        <MenuSidebar />
        {children}
      </div>
    </RootLayout>
  );
};

export default AdminLayout;
