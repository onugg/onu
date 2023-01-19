import React, { useState } from "react";
import type { User } from "@/types";

type Props = {
  users: User[];
};

const Leaderboard: React.FC<Props> = ({ users }) => {
  const [page, setPage] = useState(1);
  const displayedUsers = users.slice((page - 1) * 50, page * 50);
  return (
    <div className="relative w-full">
      <div className=" grid grid-cols-3 gap-x-4">
        {displayedUsers.slice(0, 3).map((user, index) => (
          <div
            className="flex h-48 flex-row items-center bg-sky-500"
            key={user.name}
          >
            <div className="h-10 w-10">{index + 1}</div>
            <div className="ml-2">
              <div className="text-lg font-bold">{user.name}</div>
              <div>Level {user.level}</div>
            </div>
            <div className="ml-auto">
              {user.change === "up" ? (
                <span
                  className="text-green-500"
                  role="img"
                  aria-label="Triangle pointing up"
                >
                  🔺
                </span>
              ) : (
                <span
                  className="text-red-500"
                  role="img"
                  aria-label="Triangle pointing down"
                >
                  🔻
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {displayedUsers.slice(3).map((user) => (
        <div className="relative flex flex-col my-2 bg-red-500" key={user.name}>
          <div className="ml-2">
            <div>{user.name}</div>
            <div>Level {user.level}</div>
          </div>
          <div className="ml-auto">
            {user.change === "up" ? (
              <span
                className="text-green-500"
                role="img"
                aria-label="Triangle pointing up"
              >
                🔺
              </span>
            ) : (
              <span
                className="text-red-500"
                role="img"
                aria-label="Triangle pointing down"
              >
                🔻
              </span>
            )}
          </div>
        </div>
      ))}
    </div>

    // <div className="">
    //   <div className="grid grid-cols-3 gap-x-2 ">
    //     {displayedUsers.slice(0, 3).map((user, index) => (
    //       <div
    //         className="flex h-48 w-32 flex-row items-center bg-sky-500"
    //         key={user.name}
    //       >
    //         <div className="h-10 w-10">{index + 1}</div>
    //         <div className="ml-2">
    //           <div className="text-lg font-bold">{user.name}</div>
    //           <div>Level {user.level}</div>
    //         </div>
    //         <div className="ml-auto">
    //           {user.change === "up" ? (
    //             <span
    //               className="text-green-500"
    //               role="img"
    //               aria-label="Triangle pointing up"
    //             >
    //               🔺
    //             </span>
    //           ) : (
    //             <span
    //               className="text-red-500"
    //               role="img"
    //               aria-label="Triangle pointing down"
    //             >
    //               🔻
    //             </span>
    //           )}
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    //     {displayedUsers.slice(3).map((user) => (
    //       <div className="flex flex-col" key={user.name}>
    //         <div className="ml-2">
    //           <div>{user.name}</div>
    //           <div>Level {user.level}</div>
    //         </div>
    //         <div className="ml-auto">
    //           {user.change === "up" ? (
    //             <span
    //               className="text-green-500"
    //               role="img"
    //               aria-label="Triangle pointing up"
    //             >
    //               🔺
    //             </span>
    //           ) : (
    //             <span
    //               className="text-red-500"
    //               role="img"
    //               aria-label="Triangle pointing down"
    //             >
    //               🔻
    //             </span>
    //           )}
    //         </div>
    //       </div>
    //     ))}
    // </div>
  );
};

export default Leaderboard;
