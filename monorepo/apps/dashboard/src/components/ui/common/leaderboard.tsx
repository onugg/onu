import React, { useState } from "react";
import Image from "next/image";
import { z } from "zod";

const UserSchema = z.object({
  name: z.string(),
  image: z.string(),
});

type UserSchema = z.infer<typeof UserSchema>;
type Props = {
  users: UserSchema[];
};

const Leaderboard: React.FC<Props> = ({ users }) => {
  return (
    <div className="bg-theme-800 relative h-1/2 w-full overflow-y-scroll scroll-smooth rounded-xl">
      {users.map((user, index) => (
        <div key={user.name}>
          <div
            className={`relative my-2 flex h-12 w-full flex-row items-center rounded-lg ${
              index % 2 === 0 ? "bg-theme-600" : "bg-theme-500"
            }`}
          >
            <div
              className={` bg-theme-700 mx-5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white ${
                index === 0 ? "bg-yellow-500" : ""
              } ${index === 1 ? "bg-neutral-400" : ""} ${
                index === 2 ? "bg-amber-800" : ""
              }  `}
            >
              {index + 1}
            </div>
            <div className="flex gap-2">
              <Image
                src={user.image}
                alt={user.name}
                width={10}
                height={10}
                className="bg-theme-700 flex h-6 w-6 rounded-full"
              />
              <div className="text-sm font-semibold text-white">
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
