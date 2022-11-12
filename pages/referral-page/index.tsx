import React from "react";
import styles from "../../styles/detailspage.module.css";
import NormalButton from "../../components/common/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import UserLayout from "../../layout/userLayout";
import { useQuery } from "jsonapi-react";
import moment from "moment";

const ReferalPage: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const { data: icosData, meta } = useQuery([
    "referrals",
    {
      page: {
        number: page,
        size: 10,
      },
    },
  ]);
  const total = meta?.total_commission;

  console.log(icosData, "data", total, meta);

  return (
    <UserLayout>
      <div className="pt-24 md:pt-28 px-4 md:px-20 pb-20 dark:bg-primary bg-white">
        <div className={styles.coverImg}></div>
        <h1 className="text-4xl text-center pt-8">
          Refer your friends - test commit{" "}
        </h1>
        <p className="text-center pt-4 border-b pb-4 border-grey-35">
          Invite and friend and get a 3% of ther amount that your friend is
          buying token of your wallet
        </p>
        <div className="my-8 mr-4 flex justify-end">
          <NormalButton label="Get your referal link" />
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-col sm:mr-8">
            <h2 className="mb-4 font-semibold">Total Partners</h2>
            <input
              type="text"
              className="rounded border border-grey-35 dark:bg-blue-d2 outline-none bg-white py-2 pr-8 pl-2"
              placeholder="0"
            />
          </div>
          <div className="flex flex-col mt-4 sm:mt-0">
            <h2 className="mb-4 font-semibold">Total Commission</h2>
            <input
              type="text"
              className="rounded border border-grey-35 dark:bg-blue-d2 bg-white outline-none py-2 pr-8 pl-2"
              placeholder="0.0000 USDT"
            />
          </div>
        </div>
        <div className="border dark:bg-blue-d2 bg-white border-grey-35 rounded px-4 xs:px-12 mt-12 overflow-x-auto">
          <div className="flex flex-wrap py-6 font-bold border-b border-grey-35 min-w-[320px]">
            <h2 className="w-1/3 xs:pl-12">Date</h2>
            <h2 className="w-1/3 text-left">Name</h2>
            <h2 className="w-1/3 text-left">Commission</h2>
          </div>
          {icosData?.map((item: any, index: any) => (
            <div
              className="flex py-6 border-b border-grey-35 dark:text-grey-c1 text-grey-6a min-w-[320px]"
              key={index}>
              <h2 className="w-1/3 text-left xs:pl-12">
                {moment(item?.created_at).format("D/M/Y")}
              </h2>
              <h2 className="w-1/3 text-left">{item.name}</h2>
              <h2 className="w-1/3 text-left xs:pr-36">{item.commission}%</h2>
            </div>
          ))}
          <div className="flex py-8 border-grey-35 text-black-0d justify-center min-w-[320px]">
            <button
              className="dark:bg-white-fa bg-primary text-white-fa dark:text-black-0d p-2 rounded-full mr-4 disabled:bg-grey-51 disabled:dark:bg-primary disabled:dark:text-grey-51"
              disabled={page <= 1}>
              <ChevronLeftIcon
                className="w-7 h-7"
                role="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (page <= 1) return;
                  setPage(page - 1);
                }}
              />
            </button>
            <button
              className="dark:bg-white-fa bg-primary text-white-fa dark:text-black-0d p-2 rounded-full disabled:bg-grey-51 disabled:dark:bg-primary disabled:dark:text-grey-51"
              disabled={page >= meta?.page?.lastPage}>
              <ChevronRightIcon
                className="w-7 h-7"
                role="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (page >= meta?.page?.lastPage) return;
                  setPage(page + 1);
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ReferalPage;
