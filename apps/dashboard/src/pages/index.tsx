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
  const { data: user } = trpc.user.getUserBySession.useQuery();
  useEffect(() => {
    if (!sessionData) {
      router.push("/auth/signin");
    }
  });
  return (
    <div className="overscroll-contain">
    <BaseLayout />
    </div>
  );
};

export default Home;

