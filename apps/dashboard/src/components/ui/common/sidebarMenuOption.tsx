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
          className={`font-small w-full rounded-lg bg-neutral-900 px-3 py-2 text-sm font-bold shadow-md
            transition duration-200 hover:text-white ${
              option.current
                ? `bg-indigo-500/20 text-white`
                : `text-neutral-400`
            }`}
        >
          <div className="flex flex-row items-center gap-3 align-baseline">
            <option.icon
              className={`h-5 w-5 group-hover:text-indigo-400 ${
                option.current ? `text-indigo-400` : ``
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
