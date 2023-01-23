import Image from "next/image";
import Link from "next/link";
import React from "react";

type CommunityCardProps = {
  image: string;
  name: string;
  slug: string;
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
      <div className="relative flex flex-col">
        <div
          className="relative flex h-40 rounded-t-xl border-neutral-700 bg-black bg-cover text-sm duration-300 group-hover:border-neutral-200 group-hover:text-neutral-100 "
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
        <div className="relative flex h-40 flex-col justify-between rounded-b-xl border-neutral-700 border-t-transparent bg-theme-800 px-4 py-4 duration-300 group-hover:border-neutral-200 group-hover:border-t-transparent">
          <div className="text-base font-semibold text-neutral-200">{name}</div>
          <div className="text-sm font-normal text-neutral-400 line-clamp-2">
            {description}
          </div>
          <Link
            className="flex h-10 w-full justify-center items-center text-sm font-bold rounded-lg bg-violet-500 text-white hover:bg-violet-700 hover:scale-105 duration-300"
            href={slug}
          >
            {`Go to ${name}`}
          </Link>
          {/* <div className="flex justify-start gap-8 text-[13px] font-normal text-neutral-500">
              <div className="flex flex-row items-center justify-center gap-1">
                <GreenDot />
                {activeMembers} Online
              </div>
              <div className="flex flex-row items-center justify-center gap-1">
                <GreyDot />
                {totalMembers} Members
              </div>
            </div> */}
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
