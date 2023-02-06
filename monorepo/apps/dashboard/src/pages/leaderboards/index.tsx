import LeaderboardLayout from "@/components/layouts/primary/leaderboardLayout";
import Leaderboard from "@/components/ui/common/leaderboard";
import React from "react";
import { IfFeatureEnabled } from "@growthbook/growthbook-react";
import type { Person } from "@/types";

const people: Person[] = [
  {
    name: "John Doe",
    id: "1",
    email: "joedoe@gmail.com",
    image: "https://i.pravatar.cc/150?img=1",
  },
];

const GlobalSeasonalLeaderboardCTA: React.FC = () => {
  return <div className="bg-theme-800 my-4 h-1/4 rounded-xl"></div>;
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
