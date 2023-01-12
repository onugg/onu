import React from "react";
import AdminLayout from "@/components/layouts/primary/adminLayout";
import DiscordMenu from "@/components/layouts/adminMenus/discordMenu";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";


const DiscordGeneral: React.FC = () => {

  const router = useRouter();
  const session = useSession();

  const slug = router.query.slug as string; 
  console.log(slug)
  const discordGuild = trpc.discord.getDiscordBySlug.useQuery({ slug: slug });
  const discordGuildId = discordGuild.data?.discordGuild?.discordId;

  const account = trpc.account.getAccountByUserIdAndProvider.useQuery({
    userId: session?.data?.user?.id,
    provider: "discord",
  });
  const textChannels = trpc.discord.getDiscordGuildTextChannels.useQuery({
    accessToken: account.data?.access_token,
    tokenType: account.data?.token_type,
    guildId: discordGuildId,
  });

  



  return (
    <AdminLayout>
      <DiscordMenu />
      <div></div>
    </AdminLayout>
  );
};

export default DiscordGeneral;