import React from "react";
import Image from "next/image";
// import styles from "./home.module.css";

const sampleArr = [
  {
    value: "$0",
    label: "Funds locked",
  },
  {
    value: "$ 0",
    label: "Total Funds Raised",
  },
  {
    value: "0",
    label: "Projects Launched",
  },
  {
    value: "0",
    label: "All-time Unique Participants",
  },
];

const Banner: React.FC = () => {
  return (
    <div
    // className={`
    // flex flex-col align-center justify-center p-4 py-10 xs:px-8 sm:px-12 md:px-20 lg:px-40  ${styles.bgImage}`}
    >
      <div className="flex flex-col xs:flex-row justify-center text-center xs:text-left xs:justify-between">
        <div className=" flex flex-col align-center justify-center">
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl ">
            Wenbit’s Token
          </h2>
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl ">
            Launch Platform
          </h2>

          <p className="mt-2 text-sm">
            Buy or earn new tokens directly on Wenbit’s
          </p>
        </div>
        <div className="m-0 mr-0 flex items-center xs:m-2 xs:mr-2 sm:m-10 sm:mr-12 md:m-10 md:mr-12 lg:m-10 lg:mr-28 p-4 justify-center xs:p-0">
          <Image
            src={"/launchpad/images/bannerImage.svg"}
            alt="Wenbit Logo"
            width={421}
            height={319}
            blurDataURL={"/launchpad/images/bannerImage.svg"}
            placeholder="blur"
          />
        </div>
      </div>
      <div
        className="
      flex flex-wrap justify-center border-none rounded-xl bg-blue-e6 text-black-0d mt-6 xs:mt-4 md:py-4
          ">
        {sampleArr.map((element, index) => (
          <div key={index} className="mx-6 my-4">
            <div className="font-bold text-center text-sm ">
              {element?.value}
            </div>
            <p className="text-sm text-center">{element?.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
