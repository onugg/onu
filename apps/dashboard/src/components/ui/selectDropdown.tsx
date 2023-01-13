import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useEffect, useState } from "react";

import type { DiscordGuild } from "@/types";
type guildSelectDropdownProps = {
  discordGuilds: DiscordGuild[];
  title: string;
  onSelection: (guild: DiscordGuild) => void;
};

const placeholderGuild = {
  id: "0",
  name: "Select a server",
  icon: null,
  owner: false,
  permissions: 0,
  features: [],
};

const GuildSelectDropdown: React.FC<guildSelectDropdownProps> = ({
  discordGuilds,
  title,
  onSelection,
}: {
  discordGuilds: DiscordGuild[];
  title: string;
  onSelection: (guild: DiscordGuild) => void;

}) => {
  const [selected, setSelected] = useState(discordGuilds?.[0]);
  useEffect(() => {
    if (onSelection) {
      onSelection(selected);
    }
  }, [onSelection, selected]);
  
  return (
    <div>
      <label htmlFor="server" className="form-label">
        {title}
      </label>

      {discordGuilds ? (
        <Listbox value={selected} onChange={setSelected} name="guild">
          <div className="relative ">
            <Listbox.Button
              className={`btn-input flex flex-row justify-between py-2 pl-3 pr-3 text-left ${
                selected?.name
                  ? ""
                  : "btn-input-error flex flex-row justify-between py-2 pl-3 pr-3 text-left"
              }`}
            >
              <span className="block truncate text-neutral-500">
                {selected?.name ? selected.name : "Select a server"}
              </span>

              <span className="pointer-events-none flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-neutral-500"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-36 w-full overflow-auto rounded-md border border-neutral-700 bg-black py-2 leading-5 text-neutral-500 placeholder-neutral-500 duration-300 hover:border-neutral-400 focus:border-neutral-400 focus:text-gray-300 focus:placeholder-transparent focus:outline-none focus:ring-neutral-400 sm:text-sm">
                {discordGuilds.map((guild: DiscordGuild) => (
                  <Listbox.Option
                    key={guild.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active
                          ? "bg-neutral-800 text-neutral-300"
                          : "text-neutral-500"
                      }`
                    }
                    value={guild}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {guild.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      ) : (
        <div className="btn-input-skeleton" />
      )}
    </div>
  );
};

export default GuildSelectDropdown;
