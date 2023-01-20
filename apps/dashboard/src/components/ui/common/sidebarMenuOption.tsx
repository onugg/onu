import React from "react";
import Link from "next/link";
import { SidebarMenuOption } from "@/types";

const SidebarMenuOption: React.FC<{ option: SidebarMenuOption }> = ({
  option,
}) => {
  return (
    <div>
      <Link className="group my-1 flex flex-col" href={option.href}>
        <div
          className={`font-small w-full border-2 rounded-lg bg-theme-800 px-3 py-2 text-sm font-bold shadow-md
            transition duration-300 hover:text-white hover:border-violet-500 hover:bg-theme-700 ${
              option.current
                ? `border-violet-700`
                : `text-theme-200 border-theme-800`
            }`}
        >
          <div className="flex flex-row items-center gap-3 align-baseline">
            <option.icon
              className={`h-5 w-5 group-hover:text-violet-400 duration-300 ${
                option.current ? `text-violet-400 border-violet-700` : ``
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
