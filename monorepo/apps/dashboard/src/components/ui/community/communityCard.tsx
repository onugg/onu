import Image from "next/image";
import Link from "next/link";
import React from "react";
import { z } from "zod";

const CommunityCardSchema = z.object({
  image: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  totalMembers: z.number(),
  activeMembers: z.number(),
});

type CommunityCardProps = z.infer<typeof CommunityCardSchema>;

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
          className="relative flex h-40 rounded-t-xl bg-black bg-cover bg-center text-sm duration-300 group-hover:text-neutral-100 "
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
        <div className="relative flex h-40 flex-col justify-between rounded-b-xl bg-gray-900 px-4 py-4 duration-300">
          <div className="text-base font-semibold text-gray-100">{name}</div>
          <div className="text-sm font-normal text-gray-300 line-clamp-2">
            {description}
          </div>
          <Link
            className="flex h-10 w-full items-center justify-center rounded-lg bg-violet-500 text-sm font-bold text-gray-200 duration-300 hover:bg-violet-700"
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
