import LeaderboardLayout from "@/components/layouts/primary/leaderboardLayout";
import Leaderboard from "@/components/ui/common/leaderboard";
import React from "react";
import { IfFeatureEnabled } from "@growthbook/growthbook-react";

import type { User } from "@/types";

const people: User[] = [
  {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    level: 26,
    change: 2,
  },
  {
    name: "Billy Jean",
    avatar: "https://i.pravatar.cc/150?img=2",
    level: 282,
    change: -4,
  },
  {
    name: "CoolDog123",
    avatar: "https://i.pravatar.cc/150?img=3",
    level: 94,
    change: 0,
  },
  {
    name: "SauceMan832784",
    avatar: "https://i.pravatar.cc/150?img=4",
    level: 37,
    change: -1,
  },
  {
    name: "FakeName",
    avatar: "https://i.pravatar.cc/150?img=5",
    level: 12,
    change: 0,
  },
  {
    name: "Hugh Mungus",
    avatar: "https://i.pravatar.cc/150?img=6",
    level: 72,
    change: 9,
  },
  {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    level: 26,
    change: 2,
  },
  {
    name: "Billy Jean",
    avatar: "https://i.pravatar.cc/150?img=2",
    level: 282,
    change: -4,
  },
  {
    name: "CoolDog123",
    avatar: "https://i.pravatar.cc/150?img=3",
    level: 94,
    change: 0,
  },
  {
    name: "SauceMan832784",
    avatar: "https://i.pravatar.cc/150?img=4",
    level: 37,
    change: -1,
  },
  {
    name: "FakeName",
    avatar: "https://i.pravatar.cc/150?img=5",
    level: 12,
    change: 0,
  },
  {
    name: "Hugh Mungus",
    avatar: "https://i.pravatar.cc/150?img=6",
    level: 72,
    change: 9,
  },
  {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    level: 26,
    change: 2,
  },
  {
    name: "Billy Jean",
    avatar: "https://i.pravatar.cc/150?img=2",
    level: 282,
    change: -4,
  },
  {
    name: "CoolDog123",
    avatar: "https://i.pravatar.cc/150?img=3",
    level: 94,
    change: 0,
  },
  {
    name: "SauceMan832784",
    avatar: "https://i.pravatar.cc/150?img=4",
    level: 37,
    change: -1,
  },
  {
    name: "FakeName",
    avatar: "https://i.pravatar.cc/150?img=5",
    level: 12,
    change: 0,
  },
  {
    name: "Hugh Mungus",
    avatar: "https://i.pravatar.cc/150?img=6",
    level: 72,
    change: 9,
  },
  {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    level: 26,
    change: 2,
  },
  {
    name: "Billy Jean",
    avatar: "https://i.pravatar.cc/150?img=2",
    level: 282,
    change: -4,
  },
  {
    name: "CoolDog123",
    avatar: "https://i.pravatar.cc/150?img=3",
    level: 94,
    change: 0,
  },
  {
    name: "SauceMan832784",
    avatar: "https://i.pravatar.cc/150?img=4",
    level: 37,
    change: -1,
  },
  {
    name: "FakeName",
    avatar: "https://i.pravatar.cc/150?img=5",
    level: 12,
    change: 0,
  },
  {
    name: "Hugh Mungus",
    avatar: "https://i.pravatar.cc/150?img=6",
    level: 72,
    change: 9,
  },
  {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    level: 26,
    change: 2,
  },
  {
    name: "Billy Jean",
    avatar: "https://i.pravatar.cc/150?img=2",
    level: 282,
    change: -4,
  },
  {
    name: "CoolDog123",
    avatar: "https://i.pravatar.cc/150?img=3",
    level: 94,
    change: 0,
  },
  {
    name: "SauceMan832784",
    avatar: "https://i.pravatar.cc/150?img=4",
    level: 37,
    change: -1,
  },
  {
    name: "FakeName",
    avatar: "https://i.pravatar.cc/150?img=5",
    level: 12,
    change: 0,
  },
  {
    name: "Hugh Mungus",
    avatar: "https://i.pravatar.cc/150?img=6",
    level: 72,
    change: 9,
  },
  {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    level: 26,
    change: 2,
  },
  {
    name: "Billy Jean",
    avatar: "https://i.pravatar.cc/150?img=2",
    level: 282,
    change: -4,
  },
  {
    name: "CoolDog123",
    avatar: "https://i.pravatar.cc/150?img=3",
    level: 94,
    change: 0,
  },
  {
    name: "SauceMan832784",
    avatar: "https://i.pravatar.cc/150?img=4",
    level: 37,
    change: -1,
  },
  {
    name: "FakeName",
    avatar: "https://i.pravatar.cc/150?img=5",
    level: 12,
    change: 0,
  },
  {
    name: "Hugh Mungus",
    avatar: "https://i.pravatar.cc/150?img=6",
    level: 72,
    change: 9,
  },
];

const GlobalSeasonalLeaderboardCTA: React.FC = () => {
  return <div className="my-4 h-1/4 rounded-xl bg-theme-800"></div>;
};

const GlobalLeaderboard: React.FC = () => {
  return (
    <IfFeatureEnabled feature="leaderboard">
      <LeaderboardLayout>
        <div className="relative flex h-screen w-full flex-col">
          <GlobalSeasonalLeaderboardCTA />
          <Leaderboard users={people} />
        </div>
      </LeaderboardLayout>
    </IfFeatureEnabled>
  );
};

export default GlobalLeaderboard;
