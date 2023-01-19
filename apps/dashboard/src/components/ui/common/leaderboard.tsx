import React, { useState } from 'react';
import type { User } from '@/types';

  type Props = {
    users: User[];
  };
  
  const Leaderboard: React.FC<Props> = ({ users }) => {
    const [page, setPage] = useState(1);
    const displayedUsers = users.slice((page - 1) * 50, page * 50);
  
    return (
      <div className="mx-8 flex flex-col items-center">
        <div className="flex flex-col items-center">
          {displayedUsers.slice(0, 3).map((user, index) => (
            <div className="flex items-center" key={user.name}>
              <div className="w-10 h-10">{index + 1}</div>
              <div className="ml-2">
                <div className="text-lg font-bold">{user.name}</div>
                <div>Level {user.level}</div>
              </div>
              <div className="ml-auto">
                {user.change === 'up' ? (
                  <span className="text-green-500" role="img" aria-label="Triangle pointing up">🔺</span>
                ) : (
                  <span className="text-red-500" role="img" aria-label="Triangle pointing down">🔻</span>
                )}
              </div>
            </div>
          ))}
          <div className="my-4">
            {displayedUsers.slice(3).map((user) => (
              <div className="flex items-center" key={user.name}>
                <div className="ml-2">
                  <div>{user.name}</div>
                  <div>Level {user.level}</div>
                </div>
                <div className="ml-auto">
                  {user.change === 'up' ? (
                    <span className="text-green-500" role="img" aria-label="Triangle pointing up">🔺</span>
                  ) : (
                    <span className="text-red-500" role="img" aria-label="Triangle pointing down">🔻</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default Leaderboard;