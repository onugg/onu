import React from "react";
import Link from "next/link";

interface Button1Props {
  href: string;
  text: string;
}

const Button1: React.FC<Button1Props> = ({ href, text }) => {
  return (
    <Link
      href={href}
      className={`flex rounded-md bg-violet-500 py-2 px-2 text-sm font-medium text-gray-200 duration-300 hover:bg-violet-700 hover:text-white`}
    >
      {text}
    </Link>
  );
};

export default Button1;
