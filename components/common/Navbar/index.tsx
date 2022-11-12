import {
  Bars3Icon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Navbar: React.FC = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [navbar, setNavbar] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderThemeChanger = (): any => {
    if (!mounted) return null;

    const currentTheme = theme === "system" ? systemTheme : theme;

    if (currentTheme === "dark") {
      return (
        <SunIcon
          className="w-7 h-7"
          role="button"
          onClick={() => setTheme("light")}
        />
      );
    } else {
      return (
        <MoonIcon
          className="w-7 h-7"
          role="button"
          onClick={() => setTheme("dark")}
        />
      );
    }
  };

  return (
    <div className="flex flex-col">
      <div className="px-2 xs:px-6 py-4 bg-primary flex flex-row justify-between align-center border-b-2 border-grey-35 text-white-fa fixed w-full z-40">
        <div className="flex justify-between w-full xs:w-72">
          <div className="flex">
            <Image
              src={"/images/wenbitLogo.svg"}
              alt="Wenbit Logo"
              width={187}
              height={43}
              blurDataURL={"/images/wenbitLogo.svg"}
              placeholder="blur"
            />
          </div>
          <div className="flex items-center xs:hidden mr-4">
            {navbar ? (
              <XMarkIcon
                className="w-7 h-7"
                role="button"
                onClick={() => setNavbar(false)}
              />
            ) : (
              <Bars3Icon
                className="w-7 h-7"
                role="button"
                onClick={() => setNavbar(true)}
              />
            )}
          </div>
          <a
            href={"/trading/"}
            className="hidden xs:flex items-center dark:text-white">{`MASTER`}</a>
        </div>
        <div className="align-center hidden xs:flex">
          <div className="flex align-center border-grey-c1 pt-2">
            {renderThemeChanger()}
          </div>
          <div className="flex align-center p-1 mx-8">
            <Image
              src={"/accounticon.svg"}
              alt="Wenbit Logo"
              width={20}
              height={20}
            />
          </div>
          <select className="bg-primary">
            <option value="">EN</option>
          </select>
        </div>
      </div>
      <div>
        <div
          className={`flex-1 justify-self-center pt-24 pb-4 px-4 bg-grey-63 dark:bg-grey-35 w-full fixed z-30 ${
            navbar ? "block" : "hidden"
          } xs:hidden`}>
          <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
            <li className="text-gray-600 hover:text-blue-600">
              <a href={"/trading/"}>{`Master`}</a>
            </li>
            <li className="text-gray-600 hover:text-blue-600">
              <div className="align-center flex pb-4">
                <div className="flex align-center border-grey-c1 pt-2">
                  {renderThemeChanger()}
                </div>
                <div className="flex align-center p-1 mx-8">
                  <Image
                    src={"/accounticon.svg"}
                    alt="Wenbit Logo"
                    width={20}
                    height={20}
                  />
                </div>
                <select className=" bg-grey-51">
                  <option value="">EN</option>
                </select>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
