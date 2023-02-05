import React, { useState } from "react";
import AdminLayout from "@/components/layouts/primary/adminLayout";
import DiscordMenu from "@/components/layouts/adminMenus/discordMenu";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import DiscordChannelSelectDropdown from "@/components/ui/discord/discordChannelSelectDropdown";
import { DiscordGuildChannel } from "@/types";

const DiscordGeneral: React.FC = () => {
  const router = useRouter();
  const session = useSession();

  const slug = router.query.slug as string;
  const discordGuild = trpc.discord.getDiscordBySlug.useQuery({ slug: slug });
  const discordGuildId = discordGuild.data?.discordGuild?.discordId;

  const account = trpc.account.getAccountByUserIdAndProvider.useQuery({
    userId: session?.data?.user?.id,
    provider: "discord",
  });
  const textChannelsRoot = trpc.discord.getDiscordGuildTextChannels.useQuery({
    accessToken: account.data?.access_token,
    tokenType: account.data?.token_type,
    guildId: discordGuildId,
  });

  function handleSelectedGuildChannel(guild: DiscordGuildChannel) {
    setSelectedGuild(guild);
  }
  const [selectedGuild, setSelectedGuild] = useState<DiscordGuildChannel>();

  return (
    <AdminLayout>
      <DiscordMenu />
      <DiscordChannelSelectDropdown
        discordGuildChannels={textChannelsRoot.data}
        title={"Discord Channels"}
        onSelection={handleSelectedGuildChannel}
      />
    </AdminLayout>
  );
};

export default DiscordGeneral;
