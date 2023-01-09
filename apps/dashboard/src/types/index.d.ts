export type AdminMenuOption = {
    name: string;
    href: string;
    icon: any;
    current: boolean;
  };
  
export type AdminMenuSection = {
    title: string;
    options: AdminMenuOption[];
  };