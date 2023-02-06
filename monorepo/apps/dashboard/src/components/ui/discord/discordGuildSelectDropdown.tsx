import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useEffect, useState } from "react";
import { z } from "zod";

const DiscordGuildSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  owner: z.boolean(),
  permissions: z.number(),
  icon_url: z.string(),
  botInGuild: z.boolean(),
  memberType: z.string(),
});

type DiscordGuildSchema = z.infer<typeof DiscordGuildSchema>;

type guildSelectDropdownProps = {
  discordGuilds: DiscordGuildSchema[];
  title: string;
  onSelection: (guild: DiscordGuildSchema) => void;
};

const DiscordGuildSelectDropdown: React.FC<guildSelectDropdownProps> = ({
  discordGuilds,
  title,
  onSelection,
}: {
  discordGuilds: DiscordGuildSchema[];
  title: string;
  onSelection: (guild: DiscordGuildSchema) => void;
}) => {
  const [selected, setSelected] = useState(discordGuilds?.[0]);
  useEffect(() => {
    if (onSelection) {
      onSelection(selected);
    }
  }, [onSelection, selected]);

  return (
    <div>
      <label
        htmlFor="server"
        className="mb-1 block text-sm font-medium text-neutral-200"
      >
        {title}
      </label>

      {discordGuilds ? (
        <Listbox value={selected} onChange={setSelected} name="guild">
          <div className="relative ">
            <Listbox.Button
              className={`focus:bg-gray-600-50 flex w-full flex-row justify-between rounded border border-gray-700 bg-gray-700/50 py-2 pl-3 pr-3 text-left leading-5 text-gray-300 placeholder-gray-400 duration-300 focus:border-gray-600 focus:bg-gray-600/50 focus:text-white focus:ring-transparent sm:text-sm ${
                selected?.name
                  ? ""
                  : "flex flex-row justify-between border-red-500 pl-3 pr-3 text-left"
              }`}
            >
              <span className="block truncate text-neutral-200">
                {selected?.name ? selected.name : "Select a server"}
              </span>

              <span className="pointer-events-none flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-neutral-200"
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
              <Listbox.Options className="bg-theme-800 absolute mt-1 max-h-36 w-full overflow-auto rounded-md border border-violet-500 py-2 leading-5 text-neutral-200 placeholder-neutral-500 duration-300 focus:text-gray-300 focus:placeholder-transparent focus:outline-none sm:text-sm">
                {discordGuilds.map((guild: DiscordGuildSchema) => (
                  <Listbox.Option
                    key={guild.id}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? "bg-violet-500 text-white" : "text-neutral-300"
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
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
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

export default DiscordGuildSelectDropdown;
