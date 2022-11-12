import Image from "next/image";
import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center md:justify-between border-white-fe dark:border-grey-35 border-t-[1px] md:px-40 py-4 bg-primary text-white-fa">
      <div className="flex justify-center">
        <Image
          src={"/images/wenbitLogo.svg"}
          alt="Wenbit Logo"
          width={87}
          height={20}
          blurDataURL={"/images/wenbitLogo.svg"}
          placeholder="blur"
        />
      </div>
      <div className="flex justify-center text-xs">
        Copyright © 2022 wenbit.com. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
