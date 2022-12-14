import Logo from "../../assets/Logo.svg";
import { InformationCircleIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import type { InferGetServerSidePropsType } from "next";
import { getProviders, signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const SignIn: React.FC<Props> = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/");
  }
  return (
    <>
      <div className="flex h-screen bg-gray-100 items-center justify-center py-12 px-4 sm:px-6 lg:px-8 faint-grid">
        <div className="bg-white rounded-lg shadow-md shadow-gray-400 w-full max-w-lg space-y-8 p-12">
          <div className="">
            <Image
              className="mx-auto h-12 w-auto"
              src={Logo}
              alt="Your Company"
            />
            <h2 className="my-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign into your Onu account
            </h2>
            <div className="rounded-md bg-sky-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InformationCircleIcon
                    className="h-5 w-5 text-sky-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-sky-500">
                    Due to Onu&apos;s intelligent application backend, a sign-up
                    process is not required.
                  </p>
                  <p className="mt-3 text-sm md:mt-0 md:ml-6"></p>
                </div>
              </div>
            </div>
          </div>
          {providers
            ? Object.values(providers).map((provider) => {
                return (
                  <button
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#424549] py-2 px-4 text-sm font-medium text-white duration-150 hover:bg-[#282b30] hover:scale-105"
                    key={provider.name}
                    onClick={() => signIn(provider.id)}
                  >
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <LockClosedIcon
                        className="h-5 w-5 text-[#7289da] group-hover:text-indigo-400"
                        aria-hidden="true"
                      />
                    </div>
                    Sign in with {provider.name}
                  </button>
                );
              })
            : ""}
        </div>
      </div>
    </>
  );
};
export default SignIn;

export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};