import Image from "next/image";
import React from "react";

const ChooseUs: React.FC = () => {
  const sampleArr = [
    {
      label: "EXPOSQURE",
      desc: "Get exposure to the millions of Binance users around the world",
      src: "/images/exposure.svg",
    },
    {
      label: "LIQUDITY",
      desc: `Projects that are launched on Launchpad or Launchpool will be listed and have world-class liquidity in multiple trading pairs.`,
      src: "/images/liquidity.svg",
    },
    {
      label: "TOKEN DISTRIBUTION",
      desc: `Your token will immediately be distributed to a large user base that hold your token.`,
      src: "/images/distributed.svg",
    },
    {
      label: "FUTURE SYNERGY",
      desc: ` Project will receive extensive support and advice even after listing, having access to all areas of the Binance ecosystem.`,
      src: "/images/teamwork.svg",
    },
  ];

  return (
    <div className="py-16 px-4 xs:px-8 sm:px-12 md:px-20 lg:px-40 bg-white dark:bg-primary">
      <div className="flex justify-center text-3xl xs:text-3xl sm:text-3xl md:text-4xl lg:text-5xl">
        <h3>Why choose us?</h3>
      </div>
      <div className="flex flex-col sm:flex-row justify-between pt-8">
        {sampleArr.map((element, index) => (
          <div className="py-8 flex flex-col items-center sm:w-1/5" key={index}>
            <Image
              src={element?.src}
              alt={element?.label}
              width={77}
              height={78}
              blurDataURL={element?.src}
            />
            <div className="font-semibold mt-2 text-center">
              {element?.label}
            </div>
            <p className="text-sm text-center mt-2 text-grey-51 dark:text-grey-c1">
              {element?.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseUs;
