import Link from "next/link";
import React from "react";
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
          className={`w-full rounded-lg py-1.5 px-2 text-sm font-medium
            transition duration-300 hover:bg-gray-700 hover:text-gray-200 ${
              option.current ? `text-white` : ` text-gray-400`
            }`}
        >
          <div className="flex flex-row items-center gap-4 align-baseline">
            <option.icon
              className={`h-5 w-5 duration-300 group-hover:text-gray-200 ${
                option.current ? ` text-white` : `text-gray-400`
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
