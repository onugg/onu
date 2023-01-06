import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useS3Upload } from "next-s3-upload";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import RootLayout from "../../components/layout";

import Navbar from "../../components/layout";
import { trpc } from "../../utils/trpc";

import type { NextPage } from "next";

type ValidationSchema = z.infer<typeof validationSchema>;

const MAX_FILE_SIZE = 200000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const PhotoPlus: React.FC = () => {
  return (
    <svg
      className="mx-auto h-12 w-12 text-neutral-400"
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
  );
};

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
        "Community slug can only contain lowercase letters, numbers and underscores",
    })
    .min(1, { message: "A slug is required" })
    .max(32, { message: "Community slug has to be between 1-32 characters" }),
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

  const mutation = trpc.community.createCommunity.useMutation({
    onSuccess: (data) => {
      const communitySlug = data.slug;
      router.push(`/c/${communitySlug}/admin`);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const { url } = await uploadToS3(data.image);
    mutation.mutate({
      name: data.name,
      slug: data.slug,
      description: data.description,
      imageUrl: url,
    });
  });
  const session = useSession();
  const username = session.data?.user?.name;
  const namePlaceholder = `${username}'s Community`;
  const descriptionPlaceholder = `This is ${username}'s community. It is a place where we can share our cool ideas.`;

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
              className={`btn-input ${errors.name && "btn-input-error"}`}
              placeholder={namePlaceholder}
              defaultValue={namePlaceholder}
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
              Slug
            </label>
            <input
              type="text"
              id="name"
              className={`btn-input ${errors.slug && "btn-input-error"}`}
              {...register("slug")}
            />
            {errors.slug && (
              <p className="mt-2 text-xs italic text-red-500">
                {errors.slug?.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-6">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className={`btn-input ${errors.description && "btn-input-error"}`}
              placeholder={descriptionPlaceholder}
              defaultValue={descriptionPlaceholder}
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
              <div
                className="relative flex h-48 justify-center rounded-xl border border-neutral-700 bg-black bg-cover bg-center text-sm duration-300"
                style={{
                  backgroundImage: `url(${localImageUrl})`,
                }}
              >
                <div className="z-5 absolute inset-0 rounded-xl bg-black/75 backdrop-blur-md" />
                <div className="z-10 flex items-center overflow-hidden">
                  <Image
                    src={localImageUrl}
                    alt="Community Profile"
                    className="relative h-[110px] w-[110px] rounded-full border border-neutral-700 object-cover duration-300 group-hover:border-neutral-100"
                    width="128"
                    height="128"
                  />
                </div>
              </div>
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
                className="mt-1 flex h-48 cursor-pointer justify-center rounded-md border-2 border-dashed border-neutral-700 bg-black px-6 pt-10 pb-6 duration-300 hover:border-neutral-400 focus:border-neutral-400"
              >
                <input
                  id="file-upload"
                  type="file"
                  className={`sr-only ${errors.image && "btn-input-error"}`}
                  {...register("image")}
                />
                <div className="space-y-1 text-center">
                  <PhotoPlus />
                  <div className="flex text-sm text-neutral-500">
                    <span>Upload a file or drag and drop</span>
                  </div>
                  <p className="text-sm text-neutral-500">
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
        </div>
        <div className="my-6 flex gap-x-4">
          <Link className="btn-1" href="/">
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
          <button type="submit" className="btn-1 px-4">
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
    if (!session.data) {
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
