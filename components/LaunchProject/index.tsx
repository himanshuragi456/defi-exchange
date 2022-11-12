import Image from "next/image";
import React from "react";
import NormalButton from "../common/Button";

const LaunchProject: React.FC = () => {
  const handleApply: VoidFunction = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSeEqTITLlTmAimRgfHpgj6lLoawVYcUE2osGoRapTrqzk7rIQ/viewform?vc=0&c=0&w=1&flr=0",
      "_blank"
    );
  };

  return (
    <div className="flex justify-between py-14 dark:bg-blue-d2 bg-white px-4 xs:px-8 sm:px-12 md:px-20 lg:px-40">
      <div className="xs:w-3/5 text-center xs:text-left">
        <h3 className="text-3xl md:text-4xl lg:text-5xl mb-4">
          Launch a project on Wenbit&apos;s now!
        </h3>
        <p className="text-md mb-7">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non omnis
          fuga quaerat quas nulla neque deleniti officia earum commodi culpa?
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
          delectus commodi amet quis, porro aliquid!
        </p>
        <NormalButton label="Apply to Launch" onClick={handleApply} />
      </div>
      <div className="hidden sm:flex">
        <Image
          src={"/images/coins.svg"}
          alt="Coins"
          width={297}
          height={252}
          blurDataURL={"/images/coins.svg"}
        />
      </div>
    </div>
  );
};

export default LaunchProject;
