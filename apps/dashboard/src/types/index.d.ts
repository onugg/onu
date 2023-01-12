export interface AdminMenuOption {
  name: string;
  href: string;
  icon: any;
  current: boolean;
}

export interface AdminMenuSection {
  title: string;
  options: AdminMenuOption[];
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  icon_url: string;
  botInGuild: boolean;
  memberType: string;
}
