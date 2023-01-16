import RootLayout from "@/components/layouts/primary/rootLayout";
import { trpc } from "@/utils/trpc";
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import type { NextPage } from "next";
import CommunityCard from "@/components/ui/community/communityCard";
import CommunityAddCard from "@/components/ui/community/communityAddCard";

const SearchBar: React.FC = () => {
  const { data: user } = trpc.user.getUserBySession.useQuery();
  return (
    <div className="relative z-10 my-12 mx-12">
      <div className="flex gap-x-4 md:mx-24 2xl:mx-72">
        <div className="relative grow">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-neutral-500"
                aria-hidden="true"
              />
            </div>
            <input
              id="search"
              name="search"
              className="btn-input pl-10 pr-3"
              placeholder="Search"
              type="search"
            />
          </div>
        </div>
        <button>
          <Link className="btn-1 px-4" href="/communities/create">
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
            <div className="hidden md:flex">Add Community</div>
          </Link>
        </button>
        <button className="btn-1">
          <AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

const OwnedCommunities: React.FC = () => {
  const user = trpc.user.getUserBySession.useQuery();
  const userId = user.data?.id as string;
  const ownedCommunities = trpc.community.getOwnedCommunitiesByUserId.useQuery({
    userId: userId,
  });
  return ownedCommunities.data?.[0] ? (
    <div className="relative z-10 mx-12 my-12">
      <div className="heading-1">Owned Communities</div>
      <div className="gap-y-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center lg:mx-24 sm:gap-x-8 2xl:mx-72 ">
        {ownedCommunities.data?.map((community) => (
          <div key={community.name}>
            <Link href={community.id}>
              <CommunityCard
                image={community.image}
                name={community.name}
                slug={community.slug}
                description={community.description}
                totalMembers={community.totalMembers}
                activeMembers={community.activeMembers}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div />
  );
};

const MemberCommunities: React.FC = () => {
  const user = trpc.user.getUserBySession.useQuery();
  const userId = user.data?.id as string;
  const memberCommunities =
    trpc.community.getMemberCommunitiesByUserId.useQuery({
      userId: userId,
    });
  return (
    <div className="relative z-10 mx-12 my-12">
      <div className="heading-1">Communities</div>
      {memberCommunities.data?.[0] ? (
      <div className="gap-y-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center lg:mx-24 sm:gap-x-8 2xl:mx-72 ">
        {memberCommunities.data?.map((community) => (
            <div key={community.name}>
              <Link href={community.id}>
                <CommunityCard
                  image={community.image}
                  name={community.name}
                  slug={community.slug}
                  description={community.description}
                  totalMembers={community.totalMembers}
                  activeMembers={community.activeMembers}
                />
              </Link>
            </div>
          ))}
          </div>
      ) : (
        <CommunityAddCard />
      )}
    </div>
  );
};

const Communities: NextPage = () => {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/auth/signin");
    }
  });

  return (
    <RootLayout>
      <div className="overflow-hidden">
        <SearchBar />
        <OwnedCommunities />
        <MemberCommunities />
      </div>
    </RootLayout>
  );
};

export default Communities;
