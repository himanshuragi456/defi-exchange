/* eslint-disable @typescript-eslint/restrict-template-expressions */
import Image from "next/image";
import Router from "next/router";
import React, { FC, Key } from "react";
import NormalButton from "../common/Button";
import Countdown from "../common/Countdown";

const LaunchpadListing: FC<any> = ({ data = [], setFilter, filter }) => {
  const handleView: Function = (id: any) => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    Router.push(`/details-page?id=${id}`)
      .then(() => console.log(""))
      .catch((err: any) => console.log(err));
  };

  return (
    <>
      <div className="px-4 xs:px-8 sm:px-12 md:px-20 lg:px-40">
        <div className="flex items-center mt-8">
          <h2 className="text-3xl font-medium py-8">Launchpad</h2>
          <div className="bg-blue-e6 m-0 ml-3 mt-2 h-0.5 w-16 xs:w-20 sm:w-28 md:w-40 lg:w-80"></div>
        </div>
        <div className="flex justify-between md:justify-start pr-8 mb-8">
          <h2
            className={`md:mr-8 cursor-pointer ${
              Object.keys(filter).length < 1 && "font-bold"
            }`}
            onClick={() => setFilter({})}>
            All
          </h2>
          <h2
            className={`md:mr-8 cursor-pointer ${
              Boolean(filter?.current) && "font-bold"
            }`}
            onClick={() =>
              setFilter({
                current: true,
              })
            }>
            Live
          </h2>
          <h2
            className={`md:mr-8 cursor-pointer ${
              Boolean(filter?.upcoming) && "font-bold"
            }`}
            onClick={() =>
              setFilter({
                upcoming: true,
              })
            }>
            Upcoming
          </h2>
          <h2
            className={`md:mr-8 cursor-pointer ${
              Boolean(filter?.past) && "font-bold"
            }`}
            onClick={() =>
              setFilter({
                past: true,
              })
            }>
            Ended
          </h2>
        </div>
        <div className="flex flex-wrap justify-center md:justify-between xs:p-4 sm:px-20 md:px-40 lg:p-0">
          {data.length > 0 ? (
            data.map((element: any, index: Key) => {
              return (
                <div className="border border-blue-e6 rounded mb-8" key={index}>
                  <Image
                    src={"/launchpad/images/cardimg.svg"}
                    alt="Wenbit Logo"
                    width={333}
                    height={152}
                    blurDataURL={"/launchpad/images/cardimg.svg"}
                    placeholder="blur"
                  />
                  <div className="mx-4">
                    <div className="mb-8 font-medium">
                      <div className="text-lg">{element?.name}</div>
                      <div className="text-sm dark:text-grey-c1 text-grey-51 mb-4">
                        {element?.currency?.currency_content?.short_description}
                      </div>
                      <div className="flex justify-between text-xs mb-4">
                        <div>Tokens Offered</div>
                        <div>
                          {parseFloat(element?.ico_stages[0].hard_cap).toFixed(
                            2
                          )}{" "}
                          {element?.config?.base_conversion_currency.toUpperCase()}
                        </div>
                      </div>
                      <div className="flex justify-between text-xs mb-4">
                        <div>Sale Price</div>
                        <div>
                          1{" "}
                          {element?.config?.base_conversion_currency.toUpperCase()}
                          =
                          {parseFloat(
                            element?.ico_stages[0].base_price
                          ).toFixed(6)}{" "}
                          {element?.currency?.symbol.toUpperCase()}
                        </div>
                      </div>
                      <div className="flex justify-between text-xs mb-4">
                        <div>Participants</div>
                        <div>{element.participants ?? 0}</div>
                      </div>
                      <div className="flex justify-between text-xs mb-4">
                        <div>Total committed</div>
                        <div>
                          {parseFloat(element.ico_stages[0].hard_cap) -
                            parseFloat(element.ico_stages[0].remaining)}{" "}
                          {element?.currency?.symbol.toUpperCase()}
                        </div>
                      </div>
                      <div className="border-t border-blue-e6 m-0 mt-2 h-0 w-88"></div>
                      <div className="flex justify-between text-xs my-4">
                        <Countdown data={element.ico_stages[0]} />
                        <div>
                          <NormalButton
                            label="View"
                            onClick={() => handleView(element.id)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center mx-auto mt-4 mb-14">
              <h4>No Events Available</h4>
            </div>
          )}
        </div>
        {data.length > 0 && (
          <div className="flex justify-center my-20">
            <NormalButton label="View All" />
          </div>
        )}
      </div>
    </>
  );
};

export default LaunchpadListing;
