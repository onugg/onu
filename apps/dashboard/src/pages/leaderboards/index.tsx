import LeaderboardLayout from "@/components/layouts/primary/leaderboardLayout";
import Leaderboard from "@/components/ui/common/leaderboard";
import React from "react";

import type { User }from "@/types";

const people: User[] = [
  {
    name: "user1",
    level: 1,
    change: "up",
  },
  {
    name: "user2",
    level: 2,
    change: "down",
  },
  {
    name: "user3",
    level: 3,
    change: "up",
  },
  {
    name: "user4",
    level: 4,
    change: "down",
  },
  {
    name: "user5",
    level: 5,
    change: "up",
  },
  {
    name: "user6",
    level: 6,
    change: "down",
  },
  {
    name: "user7",
    level: 7,
    change: "up",
  },
  {
    name: "user1",
    level: 1,
    change: "up",
  },
  {
    name: "user2",
    level: 2,
    change: "down",
  },
  {
    name: "user3",
    level: 3,
    change: "up",
  },
  {
    name: "user4",
    level: 4,
    change: "down",
  },
  {
    name: "user5",
    level: 5,
    change: "up",
  },
  {
    name: "user6",
    level: 6,
    change: "down",
  },
  {
    name: "user7",
    level: 7,
    change: "up",
  },
    {
    name: "user1",
    level: 1,
    change: "up",
  },
  {
    name: "user2",
    level: 2,
    change: "down",
  },
  {
    name: "user3",
    level: 3,
    change: "up",
  },
  {
    name: "user4",
    level: 4,
    change: "down",
  },
  {
    name: "user5",
    level: 5,
    change: "up",
  },
  {
    name: "user6",
    level: 6,
    change: "down",
  },
  {
    name: "user7",
    level: 7,
    change: "up",
  },

];
const GlobalLeaderboard: React.FC = () => {
  return (
    <LeaderboardLayout>
      <Leaderboard users={people} />
    </LeaderboardLayout>
  );
};

export default GlobalLeaderboard;
