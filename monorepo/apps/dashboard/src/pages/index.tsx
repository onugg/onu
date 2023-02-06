import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!sessionData) {
      router.push("/auth/signin");
    } else router.push("/communities");
  });
  return <></>;
};

export default Home;
