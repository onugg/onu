import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface ButtonInputProps {
  placeholder: string;
}

const ButtonInput: React.FC<ButtonInputProps> = ({ placeholder }) => {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon
          className="h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </div>
      <input
        id="search"
        name="search"
        className="block w-full rounded-md border border-gray-700 bg-gray-700/50 py-2 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-400 duration-300 focus:border-gray-600 focus:bg-gray-600/50 focus:text-white focus:ring-transparent sm:text-sm"
        placeholder={placeholder}
        type="search"
      />
    </div>
  );
};

export default ButtonInput;
