/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useState } from "react";
import { SocialIcon } from "react-social-icons";
import styles from "../../styles/detailspage.module.css";
import UserLayout from "../../layout/userLayout";
import NormalButton from "../../components/common/Button";
import PopupModal from "../../components/common/PopupModal";
import { useRouter } from "next/router";
import { useQuery } from "jsonapi-react";
import Countdown from "../../components/common/Countdown";
import ReactHtmlParser from "react-html-parser";

const DetailsPage: React.FC = () => {
  const sampleBtns = [
    "Website",
    "Whitepaper",
    "GMT Research Report",
    "View detailed rules",
    "FAQ's",
  ];

  const router = useRouter();

  const ID = router.query.id;

  const { data: pageDataIco }: any = useQuery([
    "public/icos",
    ID,
    {
      include: [
        "next_stage",
        "ico_stages",
        "current_stage",
        "currency",
        "payment_currencies",
      ],
    },
  ]);

  const pageData = pageDataIco?.[0];

  console.log(pageData, "page data");

  const stageData =
    Boolean(pageData) && Boolean(pageData?.current_stage)
      ? pageData?.current_stage
      : pageData?.next_stage
      ? pageData?.next_stage
      : pageData?.ico_stages?.[0];

  // eslint-disable-next-line no-extra-boolean-cast
  const tokensOffered = Boolean(stageData?.hard_cap)
    ? `${parseFloat(stageData?.hard_cap).toFixed(2)}`
    : 0;

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/strict-boolean-expressions
  const tokenUnit =
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/strict-boolean-expressions
    pageData?.config?.base_conversion_currency
      ? // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${pageData?.config?.base_conversion_currency.toUpperCase()}`
      : "units";

  const salePrice = stageData?.base_price
    ? `${parseFloat(stageData?.base_price).toFixed(6)}`
    : 0;
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const saleSymbol = pageData?.currency?.symbol
    ? `${pageData?.currency?.symbol.toUpperCase()}`
    : "S";
  const hardCap = stageData?.hard_cap ? parseFloat(stageData?.hard_cap) : 0;
  const remaining = parseFloat(stageData?.remaining);

  const totalCommited = hardCap - remaining ? `${hardCap - remaining}` : "0";

  const progress =
    totalCommited && hardCap
      ? ((parseFloat(totalCommited) / hardCap) * 100).toFixed(2)
      : 0;

  const cardsArr = [
    {
      label: "Tokens Offered",
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      value: tokensOffered + " " + (tokenUnit ?? "units"),
    },
    {
      label: "Sale Price",
      value: "1" + tokenUnit + " = " + salePrice + saleSymbol,
    },
    {
      label: "Participants",
      value: pageData?.participants ?? 0,
    },
    {
      label: "Total Commited",
      value: totalCommited + saleSymbol,
    },
  ];

  const [ShowPopup, setShowPopup] = useState(false);

  return (
    <>
      <UserLayout>
        <div className="pt-24 md:pt-28 px-4 md:px-20 dark:bg-primary bg-white">
          <div className={styles.coverImg}></div>
          <div className="mt-2 md:mt-8 flex justify-between">
            <div className="flex items-center">
              {Boolean(pageData?.currency?.name) && (
                <h2 className="mr-4 font-semibold">
                  {pageData?.currency.name}
                </h2>
              )}
              <NormalButton label={stageData?.name ?? "Loading..."} />
            </div>
            <Countdown data={pageData?.ico_stages?.[0]} />
          </div>
          <div className="mt-4 flex text-xs xs:text-base justify-between">
            <p>{pageData?.name}</p>
            <NormalButton label="Buy Now" onClick={() => setShowPopup(true)} />
          </div>
          <div className="flex flex-wrap mt-4">
            {sampleBtns.map((element, index) => (
              <button
                className="md:py-0.5 px-1.5 mr-1 md:mr-2 rounded-md bg-grey-f3 text-black-0d text-xs md:font-normal mt-2"
                key={index}>
                {element}
              </button>
            ))}
          </div>
          <div className="flex flex-col md:flex-row md:mt-20 mt-10">
            <div className="flex flex-col md:w-3/5 md:p-2 ">
              <div className="flex flex-wrap">
                {cardsArr.map((element, key) => (
                  <div className="flex flex-col min-w-fit mr-10 mt-4" key={key}>
                    <h3 className="text-grey-9e dark:text-grey-c3">
                      {element?.label}
                    </h3>
                    <p>{element?.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col md:pr-40">
                <h1 className="mt-10 md:mt-20 font-semibold">
                  {pageData?.name}
                </h1>
                {pageData?.currency?.currency_content?.content?.map(
                  (item: any, index: any) => (
                    <>
                      <h2 className="mt-4 font-semibold">
                        {item?.attributes?.name}
                      </h2>
                      {ReactHtmlParser(item?.attributes?.details)}
                    </>
                  )
                )}
              </div>
            </div>
            <div className="flex flex-col  md:w-2/5 md:pt-48">
              <h2 className="font-semibold my-4">Progress</h2>
              <div className="w-full mt-2 h-2 rounded bg-grey-ea dark:bg-grey-63">
                <div
                  className="bg-blue-e6 h-full rounded"
                  style={{ width: `${progress}%` }}></div>
              </div>
              <p className="dark:text-grey-c1 text-grey-51 mb-14">
                {progress}%
              </p>
              <div className="border dark:border-blue-28 border-white-e2 shadow dark:bg-blue-d2 bg-white rounded-md px-5">
                <h2 className="mt-4 mb-8">STEPN Token Sale and Economics</h2>
                <div className="flex justify-between">
                  <p className="w-1/2 dark:border-blue-28 border-white-e2 border-b dark:text-grey-c1 text-sm py-2">
                    Hard Cap
                  </p>
                  <p className="w-1/2 border-b border-l dark:border-blue-28 border-white-e2 pl-4 dark:text-grey-c1 text-sm py-2">
                    {hardCap} {tokenUnit}
                  </p>
                </div>
                <div className="flex justify-between ">
                  <p className="w-1/2 border-b dark:border-blue-28 border-white-e2 dark:text-grey-c1 text-sm py-2">
                    Total Token Supply
                  </p>
                  <p className="w-1/2 border-b dark:border-blue-28 border-white-e2 border-l pl-4 dark:text-grey-c1 text-sm py-2">
                    {tokensOffered + " " + tokenUnit}
                  </p>
                </div>
                <div className="flex justify-between ">
                  <p className="w-1/2 border-b dark:border-blue-28 border-white-e2 dark:text-grey-c1 text-sm py-2">
                    lnitial Circulating Supply
                  </p>
                  <p className="w-1/2 border-b border-l dark:border-blue-28 border-white-e2 pl-4 dark:text-grey-c1 text-sm py-2">
                    10% of Total Token Supply
                  </p>
                </div>
                <div className="flex justify-between ">
                  <p className="w-1/2 dark:text-grey-c1 text-sm py-2">
                    Tokens offered
                  </p>
                  <p className="w-1/2  border-l dark:border-blue-28 border-white-e2 pl-4 dark:text-grey-c1 text-sm py-2">
                    {tokensOffered + " " + tokenUnit}
                  </p>
                </div>
                <div className="flex justify-between ">
                  <p className="w-1/2 border-b dark:border-blue-28 border-white-e2 dark:text-grey-c1 text-sm py-2">
                    Hard Cap Per User
                  </p>
                  <p className="w-1/2 border-b border-l dark:border-blue-28 border-white-e2 pl-4 dark:text-grey-c1 text-sm py-2">
                    {pageData?.ico_stages?.[0].max_purchase
                      ? parseFloat(
                          pageData?.ico_stages[0].max_purchase
                        ).toFixed(2)
                      : 0}{" "}
                    {tokenUnit}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="w-1/2 dark:text-grey-c1 text-sm py-2">
                    Token Distribution
                  </p>
                  <p className="w-1/2 border-l dark:border-blue-28 border-white-e2 pl-4 dark:text-grey-c1 text-sm py-2 pb-6">
                    After the end of token sale
                  </p>
                </div>
              </div>
              <div className="border dark:border-blue-28 border-white-e2 shadow dark:bg-blue-d2 bg-white rounded-md px-5 my-20 py-6">
                <h2 className="my-4">Social Channels</h2>
                {pageData?.currency?.currency_content?.additional_links?.map(
                  (item: any, index: any) => (
                    <div className="flex mb-2" key={index}>
                      <SocialIcon
                        url={item?.attributes?.url}
                        bgColor="#1DA1F2"
                        style={{ width: "17px", height: "17px" }}
                      />
                      <p className="pl-2 text-xs">
                        {item?.attributes.url}/{item?.key}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </UserLayout>
      <PopupModal
        showModal={ShowPopup}
        setShowModal={setShowPopup}
        pageData={pageData}
      />
    </>
  );
};

export default DetailsPage;
