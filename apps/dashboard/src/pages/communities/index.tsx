import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  UserCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

import Navbar from "../../components/layouts/navbar";
import Logo from "../../assets/500x500Light.png";
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
              className="block w-full rounded-md border border-neutral-700 bg-black py-2 pl-10 pr-3 leading-5 text-neutral-500 placeholder-neutral-500 duration-300 focus:border-neutral-400 focus:text-gray-300 focus:placeholder-transparent focus:outline-none focus:ring-neutral-400 sm:text-sm"
              placeholder="Search"
              type="search"
            />
          </div>
        </div>
        <button className="flex rounded-md border border-neutral-100 bg-neutral-100 py-2 px-2 text-sm font-medium text-neutral-900 duration-300 hover:scale-110 hover:bg-black hover:text-neutral-100 focus:border-neutral-100 focus:bg-black focus:text-neutral-100 md:px-4">
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
          <div className="hidden md:flex">Add Community</div>
        </button>
        <button className="justify-center rounded-md border border-neutral-100 bg-neutral-100 py-2 px-2 text-sm font-medium text-neutral-900 duration-300 hover:scale-110 hover:bg-black hover:text-neutral-100 focus:border-neutral-100 focus:bg-black focus:text-neutral-100">
          <AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

const OwnedCommunities: React.FC = () => {
  return (
    <div className="relative z-10 mx-12 my-12">
      <div className="my-8 grid grid-cols-1 justify-center text-lg font-semibold text-neutral-100 md:mx-24 md:grid-cols-3 md:gap-x-8 2xl:mx-72">
        Owned Communities
      </div>
      <div className=" grid grid-cols-1 justify-center md:mx-24 md:grid-cols-3 md:gap-x-8 2xl:mx-72 ">
        {OwnedCommunitiesSample.map((community) => (
          <div key={community.name}>
            <Link
              href={community.id}
              className="relative flex h-48 justify-center rounded-xl border border-neutral-700 bg-black text-sm duration-150 hover:border-2 hover:border-neutral-100 hover:text-neutral-100"
            >
              <div className="flex items-center">
                <Image
                  src={Logo}
                  alt="Community"
                  className="rounded-full border border-neutral-700"
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

const Members: React.FC = () => {
  return (
    <div className="relative z-10 mx-12 my-12">
      <div className="my-8 grid grid-cols-1 justify-center text-lg font-semibold text-neutral-100 md:mx-24 md:grid-cols-3 md:gap-x-8 2xl:mx-72">
        Members
      </div>
      <div className=" grid grid-cols-1 justify-center md:mx-24 md:grid-cols-3 md:gap-x-8 2xl:mx-72 ">
        {MemberCommunitiesSample.map((community) => (
          <div key={community.name}>
            <Link
              href={community.id}
              className="relative flex h-48 justify-center rounded-xl border border-neutral-700 bg-black text-sm duration-150 hover:border-2 hover:border-neutral-100 hover:text-neutral-100"
            >
              <div className="flex items-center">
                <Image
                  src={Logo}
                  alt="Community"
                  className="rounded-full border border-neutral-700"
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
  const { data: sessionData } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!sessionData) {
      router.push("/auth/signin");
    }
  });
  return (
    <div className="min-h-screen bg-neutral-900">
      <Navbar />
      <div className="overflow-hidden">
        <SearchBar />
        <OwnedCommunities />
        <Members />
      </div>
    </div>
  );
};

export default Communities;
