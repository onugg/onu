import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Logo from "../assets/Logo.svg";
import { signOut } from "next-auth/react";

import { trpc } from "../utils/trpc";
import BaseLayout from "../components/layouts/base";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!sessionData) {
      router.push("/auth/signin");
    }
  });
  return (
    <>
    <BaseLayout />
    </>
  );
};

export default Home;

const Navbar: React.FC = () => {
  const { data: user } = trpc.user.getUserBySession.useQuery();

  return ( 
    <div className="min-w-screen h-full bg-gray-100">
    <SideNavbar />
    </div>
  );
};
