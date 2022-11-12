import Banner from "../components/Banner";
import LaunchpadListing from "../components/LaunchpadListing";
import LaunchProject from "../components/LaunchProject";
import ChooseUs from "../components/ChooseUs";
import FAQs from "../components/FAQs";
import UserLayout from "../layout/userLayout";
// import { useQuery } from "jsonapi-react";
import React, { ReactNode } from "react";

function Home(): ReactNode {
  const [filter, setFilter] = React.useState({});
  // const { data: icosData } = useQuery([
  //   "public/icos",
  //   {
  //     filter,
  //     include: [
  //       "next_stage",
  //       "ico_stages",
  //       "current_stage",
  //       "currency",
  //       "payment_currencies",
  //     ],
  //   },
  // ]);

  return (
    <UserLayout>
      <div className="bg-white dark:bg-primary flex flex-col justify-between align-center pt-20">
        <Banner />
        <LaunchpadListing
          // data={icosData}
          setFilter={setFilter}
          filter={filter}
        />
      </div>
      <LaunchProject />
      <ChooseUs />
      <FAQs />
      <div className="bg-white dark:bg-primary p-8"></div>
    </UserLayout>
  );
}

export default Home;
