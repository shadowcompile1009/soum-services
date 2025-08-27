import { Nullable } from "@declarations/nullable/nullable.type";
import { SocialLinks } from "@components/SocialLinks/SocialLinks";
import { IoMenu } from "react-icons/io5";
import { fromEitherJSON } from "@utils/either";
import { useClientSideProps } from "../../../../../../context/ClientSideProps";
import { JSX } from "react";
import React from "react";
import { Link } from "react-router-dom";
import Dropdown from "@components/Dropdown/Dropdown";
import { getCloudImageUrl } from "@utils/cloudimage/cloudimage";

export const NavigationAndDownloadLinksPane = (): Nullable<JSX.Element> => {
  const { clientSideProps } = useClientSideProps();

  const result = clientSideProps?.categories
    ? fromEitherJSON(clientSideProps.categories)
    : undefined;

  if (!result || result.isLeft()) {
    return null;
  }

  return (
    <div className="w-full bg-[#04196c] text-white">
      <div className="max-w-screen-xl mx-auto flex justify-between gap-3 py-7 px-3">
        <div className="gap-3 items-center hidden md:flex">
          <Dropdown>
            <div className="flex flex-row gap-3  items-center">
              <IoMenu className="text-xl" />
              <span className="font-bold text-xl text-nowrap">
                All Categories
              </span>
            </div>
          </Dropdown>
        </div>
        <div className="flex gap-5 justify-between w-full md:gap-20 md:justify-end">
          <a href="#" target="_blank" className="flex gap-3 items-center ">
            <img src={getCloudImageUrl("/download.svg")} alt="" />
            <span className="text-sm font-normal ">Download App</span>
          </a>
          <SocialLinks />
        </div>
      </div>
    </div>
  );
};
