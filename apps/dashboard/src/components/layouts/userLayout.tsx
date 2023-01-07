import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import RootLayout from "./rootLayout";
import { trpc } from "../../utils/trpc";

const MenuSidebar: React.FC = () => {
  return (
    <div className="min-h-screen w-64 border-r border-neutral-600 bg-black/50">
      <div></div>
    </div>
  );
};

const UserLayout = ({ children }: { children: React.ReactNode }) => {
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

  // To do: Make sure only
  const memberData = member?.data;
  useEffect(() => {
    // To do: Research if there is a cleaner way of doing this routing
    if (session.status === "authenticated") {
      if (memberData?.role === "owner" || "admin" || "member") {
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
        <MenuSidebar />
        {children}
      </div>
    </RootLayout>
  );
};

export default UserLayout;
