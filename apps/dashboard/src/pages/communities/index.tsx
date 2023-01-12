import React from "react";
import RootLayout from "../../components/layouts/rootLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  UserCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

import { trpc } from "../../utils/trpc";

import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

const OwnedCommunitiesSample = [
  {
    name: "Owned Community 1",
    image:
      "https://cdn.discordapp.com/avatars/8917045513364434/102f0fe2cf4086daddab8bdd6af98d.png",
    id: "12345678901",
    role: "Owner",
    members: 821,
  },
  {
    name: "Owned Community 2",
    image:
      "https://cdn.discordapp.com/avatars/8917045513364434/102f0fe2cf4086daddab8bdd6af98d.png",
    id: "12345678902",
    role: "Owner",
    members: 4921,
  },
  {
    name: "Owned Community 3",
    image:
      "https://cdn.discordapp.com/avatars/8917045513364434/102f0fe2cf4086daddab8bdd6af98d.png",
    id: "12345678903",
    role: "Owner",
    members: 302849,
  },
];

const MemberCommunitiesSample = [
  {
    name: "Member Community 1",
    image:
      "https://cdn.discordapp.com/avatars/8917045513364434/102f0fe2cf4086daddab8bdd6af98d.png",
    id: "12345678901",
    role: "Member",
    members: 821,
  },
  {
    name: "Member Community 2",
    image:
      "https://cdn.discordapp.com/avatars/8917045513364434/102f0fe2cf4086daddab8bdd6af98d.png",
    id: "12345678902",
    role: "Member",
    members: 4921,
  },
  {
    name: "Member Community 3",
    image:
      "https://cdn.discordapp.com/avatars/8917045513364434/102f0fe2cf4086daddab8bdd6af98d.png",
    id: "12345678903",
    role: "Member",
    members: 302849,
  },
  {
    name: "Member Community 4",
    image:
      "https://cdn.discordapp.com/avatars/8917045513364434/102f0fe2cf4086daddab8bdd6af98d.png",
    id: "12345678904",
    role: "Member",
    members: 302849,
  },
  {
    name: "Member Community 5",
    image:
      "https://cdn.discordapp.com/avatars/8917045513364434/102f0fe2cf4086daddab8bdd6af98d.png",
    id: "12345678905",
    role: "Member",
    members: 302849,
  },
];

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
  const { data: user } = trpc.user.getUserBySession.useQuery();
  const profileImage = user?.image as string;
  return (
    <div className="relative z-10 mx-12 my-12">
      <div className="heading-1">Owned Communities</div>
      <div className="grid grid-cols-1 justify-center md:mx-24 md:grid-cols-3 md:gap-x-8 2xl:mx-72 ">
        {OwnedCommunitiesSample.map((community) => (
          <div key={community.name}>
            <Link
              href={community.id}
              className="group relative flex h-48 justify-center rounded-xl border border-neutral-700 bg-black bg-cover text-sm duration-300 hover:scale-105 hover:border-2 hover:border-neutral-100 hover:text-neutral-100"
              style={{
                backgroundImage: `url(${profileImage})`,
              }}
            >
              <div className="z-5 absolute inset-0 rounded-xl bg-black/75 backdrop-blur-md" />
              <div className="z-10 flex items-center overflow-hidden">
                <Image
                  src={profileImage}
                  alt="Community"
                  className="h-[110px] w-[110px] rounded-full border border-neutral-700 duration-300 group-hover:border-neutral-100"
                  width="128"
                  height="128"
                />
              </div>
            </Link>

            <div className="my-2 mx-2 flex justify-between font-medium">
              <div className="flex w-1/2 flex-wrap">
                <div>
                  {community.name}
                  <br />
                  <p className="text-sm font-light leading-8 text-neutral-400">
                    {community.role}
                  </p>
                </div>
              </div>
              <div className="flex w-1/2 flex-row items-center justify-end gap-x-2 font-light text-neutral-400">
                <UserCircleIcon className="w-8" />
                <div>{community.members}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Members: React.FC = () => {
  const { data: user } = trpc.user.getUserBySession.useQuery();
  const profileImage = user?.image as string;
  return (
    <div className="relative z-10 mx-12 my-12">
      <div className="heading-1">Members</div>
      <div className=" grid grid-cols-1 justify-center md:mx-24 md:grid-cols-3 md:gap-x-8 2xl:mx-72 ">
        {MemberCommunitiesSample.map((community) => (
          <div key={community.name}>
            <Link
              href={community.id}
              className="group relative flex h-48 justify-center rounded-xl border border-neutral-700 bg-black bg-cover text-sm duration-300 hover:scale-105 hover:border-2 hover:border-neutral-100 hover:text-neutral-100"
              style={{
                backgroundImage: `url(${profileImage})`,
              }}
            >
              <div className="z-5 absolute inset-0 rounded-xl bg-black/75 backdrop-blur-md" />
              <div className="z-10 flex items-center overflow-hidden">
                <Image
                  src={profileImage}
                  alt="Community"
                  className="h-[110px] w-[110px] rounded-full border border-neutral-700 duration-300 group-hover:border-neutral-100"
                  width="128"
                  height="128"
                />
              </div>
            </Link>
            <div className="my-2 mx-2 flex justify-between font-medium">
              <div className="flex w-1/2 flex-wrap">
                <div>
                  {community.name}
                  <br />
                  <p className="text-sm font-light leading-8 text-neutral-400">
                    {community.role}
                  </p>
                </div>
              </div>
              <div className="flex w-1/2 flex-row items-center justify-end gap-x-2 font-light text-neutral-400">
                <UserCircleIcon className="w-8" />
                <div className="">{community.members}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
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
        <Members />
      </div>
    </RootLayout>
  );
};

export default Communities;
