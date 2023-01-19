import React from "react";
import Link from "next/link";
import { SidebarMenuOption } from "@/types";

const SidebarMenuOption: React.FC<{ option: SidebarMenuOption }> = ({ option }) => {
    return (
        <div>
        <Link className="group flex flex-col my-1" href={option.href}>
        <div
          className={`font-small font-bold w-full bg-neutral-900 rounded-lg shadow-md px-3 py-2 text-sm
            transition duration-200 hover:text-white ${
              option.current
                ? `bg-indigo-500/20 text-white`
                : `text-neutral-400`
            }`}
        >
          <div className="flex flex-row items-center gap-3 align-baseline">
          <option.icon className={`h-5 w-5 group-hover:text-indigo-400 ${option.current ? `text-indigo-400` : ``}`} />
            {option.name}
          </div>
        </div>
      </Link>
      </div>
    )
}

export default SidebarMenuOption;
