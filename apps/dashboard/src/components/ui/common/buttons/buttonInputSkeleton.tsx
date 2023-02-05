import React from "react";

interface ButtonInputSkeletonProps {
  color: string;
  borderColor: string;
}

const ButtonInputSkeleton: React.FC<ButtonInputSkeletonProps> = ({
  color,
  borderColor,
}) => {
  return (
    <button
      className={`block h-10 w-full animate-pulse flex-row justify-between rounded-md border border-${borderColor} bg-${color} py-2 pl-3 pr-3 leading-5 duration-300`}
    />
  );
};

export default ButtonInputSkeleton;
