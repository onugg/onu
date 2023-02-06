import React from "react";
import Link from "next/link";
import { z } from "zod";

const SidebarMenuOptionSchema = z.object({
  name: z.string(),
  href: z.string(),
  icon: z.any(),
  current: z.boolean(),
});

type SidebarMenuOption = z.infer<typeof SidebarMenuOptionSchema>;

const SidebarMenuOption: React.FC<{ option: SidebarMenuOption }> = ({
  option,
}) => {
  return (
    <div>
      <Link className="group my-1 flex flex-col" href={option.href}>
        <div
          className={`font-small bg-theme-800 hover:bg-theme-700 w-full rounded-lg border-2 px-3 py-2 text-sm font-bold
            shadow-md transition duration-300 hover:border-violet-500 hover:text-white ${
              option.current
                ? `border-violet-700`
                : `text-theme-200 border-theme-800`
            }`}
        >
          <div className="flex flex-row items-center gap-3 align-baseline">
            <option.icon
              className={`h-5 w-5 duration-300 group-hover:text-violet-400 ${
                option.current ? `border-violet-700 text-violet-400` : ``
              }`}
            />
            {option.name}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SidebarMenuOption;
