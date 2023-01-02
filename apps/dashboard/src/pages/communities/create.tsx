import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import React, { ComponentProps, forwardRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import Navbar from "../../components/layouts/navbar";

import type { NextPage } from "next";

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

// Define a zod schema for the form data
const formDataSchema = z.object({
  name: z.string().min(1).max(32),
  description: z.string().min(1).max(1028),
  image: z.string().min(1),
});

const validateFormData = (inputs: unknown) => {
  const isValidData = formDataSchema.parse(inputs);
  console.log(isValidData);
  return isValidData;
};

const Form: React.FC = () => {
  const { data: sessionData } = useSession();
  const username = sessionData?.user?.name;
  return (
    <form className="mx-12 space-y-8" onSubmit={validateFormData}>
      <div className="heading-1">Create Community</div>
      <div className="md:mx-24 2xl:mx-72">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-neutral-500"
            >
              Name
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                name="name"
                id="name"
                className="btn-input"
                placeholder={`${username}'s Community`}
                defaultValue={`${username}'s Community`}
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label
              htmlFor="about"
              className="block text-sm font-medium text-neutral-500"
            >
              About
            </label>
            <div className="mt-1">
              <textarea
                id="about"
                name="about"
                rows={3}
                className="btn-input"
                placeholder={`This is ${username}'s community. It is a place where we can share our cool ideas.`}
                defaultValue={`This is ${username}'s community. It is a place where we can share our cool ideas.`}
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="cover-photo"
              className="block text-sm font-medium text-neutral-500"
            >
              Cover photo
            </label>
            <label
              htmlFor="file-upload"
              className="focus:border-neutral-00 mt-1 flex cursor-pointer justify-center rounded-md border-2 border-dashed border-neutral-700 bg-black px-6 pt-5 pb-6 duration-300 hover:border-neutral-400"
            >
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
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
          </div>
        </div>
        <div className="my-6 flex gap-x-4">
          <button className="btn-1">
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="submit" className="btn-1 px-4">
            Create
          </button>
        </div>
      </div>
    </form>
  );
};

const CreateCommunity: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!sessionData) {
      router.push("/auth/signin");
    }
  });

  return (
    <div className="min-h-screen bg-neutral-900">
      <Navbar />
      <div className="overflow-hidden">
        <Form />
      </div>
    </div>
  );
};

export default CreateCommunity;
