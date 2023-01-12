import React from "react";
import AdminLayout from "@/components/layouts/primary/adminLayout";
import DiscordMenu from "@/components/layouts/adminMenus/discordMenu";


const DiscordGeneral: React.FC = () => {
  return (
    <AdminLayout>
      <DiscordMenu />
      <div>Discord General</div>
    </AdminLayout>
  );
};

export default DiscordGeneral;