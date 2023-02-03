import RootLayout from "@/components/layouts/primary/rootLayout";
import DiscordGuildSelectDropdown from "@/components/ui/discord/discordGuildSelectDropdown";
import { trpc } from "@/utils/trpc";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useS3Upload } from "next-s3-upload";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { NextPage } from "next";
import type { DiscordGuild } from "@/types";

type ValidationSchema = z.infer<typeof validationSchema>;

const MAX_FILE_SIZE = 200000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const validationSchema = z.object({
  name: z
    .string()
    .min(1, { message: "A name is required" })
    .min(5, { message: "Community Names has to be between 5-32 characters" })
    .max(32, { message: "Community Names has to be between 5-32 characters" }),
  slug: z
    .string()
    .regex(/^[a-z0-9_]+$/, {
      message:
        "Community URL can only contain lowercase letters, numbers and underscores",
    })
    .min(1, { message: "A URL is required" })
    .min(5, { message: "Community URL has to be between 5-32 characters" })
    .max(32, { message: "Community URL has to be between 5-32 characters" }),
  description: z
    .string()
    .min(1, { message: "A description is required" })
    .max(256, { message: "Description has to be less than 256 characters" }),
  image: z
    .custom<FileList>()
    .refine((file) => file?.length == 1, "Image is required.")
    .transform(([file]) => file)
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 2MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

const Form: React.FC = () => {
  const router = useRouter();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const imageList = watch("image", undefined) as unknown as
    | FileList
    | undefined;

  const localImageUrl = useMemo(() => {
    const image = imageList?.item(0);
    if (image) {
      return URL.createObjectURL(image);
    }
  }, [imageList]);

  const { uploadToS3 } = useS3Upload();

  const userData = trpc.user.getUserBySession.useQuery();
  const user = userData.data;

  const memberMutation = trpc.member.createMember.useMutation();
  const createDiscordGuildMutation =
    trpc.discord.createDiscordGuild.useMutation();

  const communityMutation = trpc.community.createCommunity.useMutation({
    onSuccess: (data) => {
      if (user) {
        memberMutation.mutate({
          communityId: data.id,
          userId: user.id,
        });
      }
      createDiscordGuildMutation.mutate({
        name: selectedGuild?.name,
        discordId: selectedGuild?.id,
        communityId: data.id,
      });
      router.push(
        `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&guild_id=${selectedGuild?.id}&disable_guild_select=true&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fdiscord&response_type=code&scope=identify%20guilds%20bot%20applications.commands%20email`
      );
    },
  });
  const session = useSession();

  const account = trpc.account.getAccountByUserIdAndProvider.useQuery({
    userId: session?.data?.user?.id,
    provider: "discord",
  });
  const ownedGuildsRoot = trpc.discord.getDiscordUnusedOwnedGuilds.useQuery({
    accessToken: account.data?.access_token,
    tokenType: account.data?.token_type,
  });
  const ownedGuilds = ownedGuildsRoot?.data;

  function handleSelectedGuild(guild: DiscordGuild) {
    setSelectedGuild(guild);
  }
  const [selectedGuild, setSelectedGuild] = useState<DiscordGuild>();

  const username = user?.name;
  const namePlaceholder =
    session.status === "authenticated"
      ? `${username}'s Community`
      : "My Community";
  const descriptionPlaceholder =
    session.status === "authenticated"
      ? `A community for ${username}'s friends`
      : "A community for my friends";
  const slugPlaceholder =
    session.status === "authenticated"
      ? `${username}-community`
      : "my-community";

  const onSubmit = handleSubmit(async (data) => {
    const { url } = await uploadToS3(data.image);
    communityMutation.mutate({
      name: data.name,
      slug: data.slug,
      description: data.description,
      imageUrl: url,
    });
  });

  return (
    <form className="mx-12 space-y-8" onSubmit={onSubmit}>
      <div className="heading-1">Create Community</div>
      <div className="md:mx-24 2xl:mx-72">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              className={`block w-full rounded-md border border-gray-700 bg-gray-700/50 py-2 pr-3 leading-5 text-gray-300 placeholder-gray-400 duration-300 focus:border-gray-600 focus:bg-gray-600/50 focus:text-white focus:ring-transparent sm:text-sm ${
                errors.name && "border-red-500 "
              }`}
              placeholder={namePlaceholder}
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-2 text-xs italic text-red-500">
                {errors.name?.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="name" className="form-label">
              URL
            </label>
            <div className="mt-1 sm:col-span-3 sm:mt-0">
              <div className="flex max-w-lg rounded-md">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-900 bg-gray-900 px-3 text-gray-400 sm:text-sm">
                  onu.gg/c/
                </span>
                <input
                  type="text"
                  id="slug"
                  placeholder={slugPlaceholder}
                  className={`focus:bg-gray-600-50 block w-full rounded-r-md border border-gray-700 bg-gray-700/50 py-2 leading-5 text-gray-300 placeholder-gray-400 duration-300 focus:border-gray-600 focus:bg-gray-600/50 focus:text-white focus:ring-transparent sm:text-sm ${
                    errors.slug && "border-red-500"
                  }`}
                  {...register("slug")}
                />
              </div>
              {errors.slug && (
                <p className="mt-2 text-xs italic text-red-500">
                  {errors.slug?.message}
                </p>
              )}
            </div>
          </div>
          <div className="sm:col-span-6">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className={`block w-full rounded-md border border-gray-700 bg-gray-700/50 py-2 pr-3 leading-5 text-gray-300 placeholder-gray-400 duration-300 focus:border-gray-600 focus:bg-gray-600/50 focus:text-white focus:ring-transparent sm:text-sm ${
                errors.description && "border-red-500"
              }`}
              placeholder={descriptionPlaceholder}
              {...register("description")}
            />
            {errors.description && (
              <p className="mt-2 text-xs italic text-red-500">
                {errors.description?.message}
              </p>
            )}
          </div>
          {localImageUrl ? (
            <div className="sm:col-span-2">
              <label htmlFor="cover-photo" className="form-label">
                Cover photo
              </label>

              <label
                htmlFor="file-upload"
                className="group relative flex h-48 cursor-pointer justify-center rounded-xl border border-gray-700 bg-black bg-cover bg-center text-sm duration-300"
                style={{
                  backgroundImage: `url(${localImageUrl})`,
                }}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  {...register("image")}
                />
                <div className="z-5 absolute inset-0 rounded-xl bg-black/75 backdrop-blur-md" />
                <Image
                  src={localImageUrl}
                  alt="Community Profile"
                  className="relative z-10 flex h-[110px] w-[110px] self-center overflow-hidden rounded-full border border-gray-700 object-cover"
                  width="128"
                  height="128"
                />
              </label>

              <p className="form-label mt-2">
                Tip: Click again to change image
              </p>

              {errors.image && (
                <p className="mt-2 text-xs italic text-red-500">
                  {errors.image?.message}
                </p>
              )}
            </div>
          ) : (
            <div className="sm:col-span-2">
              <label htmlFor="cover-photo" className="form-label">
                Cover photo
              </label>
              <label
                htmlFor="file-upload"
                className="mt-1 flex h-48 cursor-pointer justify-center rounded-md border-2 border-dashed border-gray-700 bg-gray-700/50 px-6 pt-10 pb-6 duration-300 focus:border-gray-600 focus:bg-gray-600/50"
              >
                <input
                  id="file-upload"
                  type="file"
                  className={`sr-only ${errors.image && "btn-input-error"}`}
                  {...register("image")}
                />
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-white"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <div className="flex text-sm text-gray-400">
                    <span>Upload a file by clicking here</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </label>
              {errors.image && (
                <p className="mt-2 text-xs italic text-red-500">
                  {errors.image?.message}
                </p>
              )}
            </div>
          )}
          <div className="col-span-6 sm:col-span-2">
            <DiscordGuildSelectDropdown
              discordGuilds={ownedGuilds}
              title={"Discord Servers"}
              onSelection={handleSelectedGuild}
            />
          </div>
        </div>
        <div className="my-6 flex gap-x-4">
          <Link
            className="flex rounded-md bg-violet-500 py-2 px-2 text-sm font-medium text-gray-200 duration-300 hover:bg-violet-700 hover:text-white"
            href="/"
          >
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
          <button
            type="submit"
            className="flex rounded-md bg-violet-500 py-2 px-6 text-sm font-medium text-gray-200 duration-300 hover:bg-violet-700 hover:text-white"
            disabled={selectedGuild?.name ? false : true}
          >
            Create
          </button>
        </div>
      </div>
    </form>
  );
};

const CreateCommunity: NextPage = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/auth/signin");
    }
  });

  return (
    <RootLayout>
      <div className="overflow-hidden">
        <Form />
      </div>
    </RootLayout>
  );
};

export default CreateCommunity;
