import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { data: user } = trpc.user.getUserBySession.useQuery();
  useEffect(() => {
    if (!sessionData) {
      router.push("/auth/signin");
    } else router.push("/communities")
  });
  return (
    <>
    </>
  );
};

export default Home;

