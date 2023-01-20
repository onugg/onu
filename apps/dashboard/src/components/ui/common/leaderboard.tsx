import React, { useState } from "react";
import type { User, StarProps } from "@/types";

type Props = {
  users: User[];
};

const Leaderboard: React.FC<Props> = ({ users }) => {
    return (
      <div className="relative my-4 w-full rounded-3xl bg-theme-800 overflow-y-scroll scroll-smooth">
        <div className="relative mx-10 h-64">
          <h1 className="my-2 mt-8 block text-lg font-bold text-neutral-200">
            Leaderboard
          </h1>
          {users.map((user, index) => (
            <div key={user.name}>
              <div
                className={`px-5 relative my-2 flex h-12 w-full flex-row rounded-lg ${
                  index % 2 === 0 ? "bg-theme-600" : "bg-theme-500"
                }`}
              >
                  <div className={`flex text-white text-xs font-semibold self-center items-center justify-center h-6 w-6 bg-theme-700 rounded-full text- ${index === 0 ? 'bg-yellow-500' : ''} ${index === 1 ? 'bg-neutral-400' : ''} ${index === 2 ? 'bg-amber-800' : ''}  `}>
                      {index + 1}
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
export default Leaderboard;
