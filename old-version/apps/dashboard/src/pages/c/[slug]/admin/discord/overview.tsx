import React from "react";
import AdminLayout from "@/components/layouts/primary/adminLayout";
import DiscordMenu from "@/components/layouts/adminMenus/discordMenu";


const DiscordOverview: React.FC = () => {
  return (
    <AdminLayout>
      <DiscordMenu />
      <div>Discord Overview</div>
    </AdminLayout>
  );
};

export default DiscordOverview;