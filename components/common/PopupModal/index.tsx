/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useMutation } from "jsonapi-react";
import Router from "next/router";
import React from "react";
import NormalButton from "../Button";

interface Props {
  showModal: boolean;
  setShowModal: Function;
  pageData: {
    id: any;
    payment_currencies: any[];
  };
}

const PopupModal: React.FC<Props> = ({ showModal, setShowModal, pageData }) => {
  const [Price, setPrice] = React.useState("");
  const [Amount, setAmount] = React.useState("");
  const [PCurrency, setPCurrency] = React.useState("");

  const handleBuyNow: Function = (e: any) => {
    e.preventDefault();
    if (isLoading) return;
    submitTransaction({
      ico_stage: {
        id: pageData?.id,
      },
      payment_currency: {
        id: PCurrency,
      },
      amount: parseFloat(Amount)?.toFixed(8),
    });
    Router.push("/referral-page")
      .then(() => setShowModal(false))
      .catch((err) => console.log(err));
  };

  const [submitTransaction, { isLoading }] = useMutation([
    "ico_transactions",
    {},
  ]);

  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none border-blue-e6">
            <div className="relative w-auto my-6 mx-auto max-w-3xl bg-white-fa dark:bg-primary rounded">
              <div className="shadow-lg relative flex flex-col w-full outline-none focus:outline-none p-10">
                <h4 className="pb-4 text-3xl">Buy Now</h4>
                <div className="flex border-white-fe dark:border-grey-35 border-t-[1px] py-6">
                  <div className="flex flex-col mr-4">
                    <label className="font-bold">Amount</label>
                    <input
                      type="text"
                      value={Amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="rounded border border-grey-35 bg-white-fa dark:bg-primary py-2 pr-8 pl-2 mt-2"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold">Price</label>
                    <input
                      type="text"
                      value={Price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="rounded border border-grey-35 bg-white-fa dark:bg-primary py-2 pr-8 pl-2 mt-2"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex border-white-fe dark:border-grey-35">
                  <div className="flex flex-col mr-4">
                    <label className="font-bold">Total</label>
                    <input
                      type="text"
                      value={parseFloat(Amount) * parseFloat(Price) || 0}
                      className="rounded border border-grey-35 bg-white-fa dark:bg-primary py-2 pr-8 pl-2 mt-2"
                      placeholder="0"
                      disabled
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="font-bold">Currency</label>
                    <select
                      onChange={(e) => setPCurrency(e.target.value)}
                      className="rounded border border-grey-35 bg-white-fa dark:bg-primary py-2 pr-8 pl-2 mt-2 w-full">
                      <option value="">Select Currency</option>
                      {pageData?.payment_currencies?.map(
                        (
                          paymentCurrency: {
                            id: string | number | readonly string[] | undefined;
                            currency_details: {
                              name:
                                | boolean
                                | React.ReactChild
                                | React.ReactFragment
                                | React.ReactPortal
                                | null
                                | undefined;
                            };
                          },
                          index: any
                        ) => {
                          if (
                            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                            paymentCurrency.id &&
                            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                            paymentCurrency?.currency_details?.name
                          ) {
                            return (
                              <option value={paymentCurrency.id} key={index}>
                                {paymentCurrency?.currency_details?.name}
                              </option>
                            );
                          } else return null;
                        }
                      )}
                    </select>
                  </div>
                </div>
                <div className="flex justify-center mt-8">
                  <NormalButton
                    label="Buy Now"
                    onClick={(e) => handleBuyNow(e)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-75 fixed inset-0 z-40 bg-black-0d"></div>
        </>
      ) : null}
    </>
  );
};

export default PopupModal;
