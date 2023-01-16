import Image from "next/image";
import Link from "next/link";
import React from "react";

type CommunityCardProps = {
  image: string;
  name: string;
  slug: string,
  description: string;
  totalMembers: number;
  activeMembers: number;
};

const GreyDot: React.FC = () => {
  return (
    <svg
      className="h-[10px] w-[10px] text-neutral-400"
      fill="currentColor"
      viewBox="0 0 8 8"
    >
      <circle cx={4} cy={4} r={3} />
    </svg>
  );
};

const GreenDot: React.FC = () => {
  return (
    <svg
      className="h-[10px] w-[10px] text-green-500"
      fill="currentColor"
      viewBox="0 0 8 8"
    >
      <circle cx={4} cy={4} r={3} />
    </svg>
  );
};

const CommunityCard: React.FC<CommunityCardProps> = ({
  image,
  name,
  slug,
  description,
  totalMembers,
  activeMembers,
}) => {
  return (
    <div>
      <Link href={`/c/${slug}`} className="group relative flex flex-col duration-300 hover:scale-105">
        <div
          className=" relative flex h-40 justify-center rounded-t-xl border border-neutral-700 bg-black bg-cover text-sm group-hover:border-2 group-hover:border-neutral-200 group-hover:text-neutral-100 duration-300 "
          style={{
            backgroundImage: `url(${image})`,
          }}
        >
          <div className="z-5 absolute inset-0 rounded-t-xl bg-black/75 backdrop-blur-md" />
          <div className="z-10 flex items-center overflow-hidden">
            <Image
              src={image}
              alt="Community"
              className="h-[100px] w-[100px] rounded-full border border-neutral-700 duration-300 group-hover:border-neutral-100"
              width="128"
              height="128"
            />
          </div>
        </div>
        <div className="relative flex h-40 rounded-b-xl border border-neutral-700 border-t-transparent bg-black group-hover:border-2 group-hover:border-t-transparent group-hover:border-neutral-200 group-hover:text-neutral-100 duration-300">
          <div className="mx-4 my-4 flex flex-col gap-2 justify-between">
            <div className="flex flex-col gap-2">
            <div className="text-base font-semibold text-neutral-200">
              {name}
            </div>
            <div className="text-sm font-normal text-neutral-500 line-clamp-3">
              {description}
            </div>
            </div>



            <div className="flex gap-8 justify-start text-[13px] font-normal text-neutral-500">
            <div className="flex flex-row items-center justify-center gap-1">
                <GreenDot />
                {activeMembers} Online
              </div>
              <div className="flex flex-row items-center justify-center gap-1">
                <GreyDot />
                {totalMembers} Members
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CommunityCard;
