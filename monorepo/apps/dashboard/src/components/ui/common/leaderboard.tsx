import React, { useState } from "react";
import type { User } from "@/types";
import Image from "next/image";

type Props = {
  users: User[];
};

const Leaderboard: React.FC<Props> = ({ users }) => {
  return (
    <div className="relative h-1/2 w-full overflow-y-scroll scroll-smooth rounded-xl bg-theme-800">
        {users.map((user, index) => (
          <div key={user.name}>
            <div
              className={`relative items-center my-2 flex h-12 w-full flex-row rounded-lg ${
                index % 2 === 0 ? "bg-theme-600" : "bg-theme-500"
              }`}
            >
              <div
                className={` mx-5 flex h-6 w-6 items-center justify-center rounded-full bg-theme-700 text-xs font-semibold text-white ${
                  index === 0 ? "bg-yellow-500" : ""
                } ${index === 1 ? "bg-neutral-400" : ""} ${
                  index === 2 ? "bg-amber-800" : ""
                }  `}
              >
                {index + 1}
              </div>
              <div className="flex gap-2">
              <Image
                  src={user.avatar}
                  alt={user.name}
                  width={10}
                  height={10}
                  className="flex h-6 w-6 rounded-full bg-theme-700"
                />
                <div className="font-semibold text-white text-sm">
                  {user.name}
                  </div>
                  </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Leaderboard;
