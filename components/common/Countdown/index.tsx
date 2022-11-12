import React, { FC, InputHTMLAttributes, useEffect, useState } from "react";
import { addZeroifSingle } from "../../../helpers";

type CountdownInterface = InputHTMLAttributes<HTMLInputElement> & {
  data?: {
    start_date: string;
    end_date: string;
  };
};

const Countdown: FC<CountdownInterface> = ({ data }) => {
  const getRemainingTime: Function = () => {
    // @ts-expect-error
    if (new Date(data?.start_date) > new Date()) {
      // @ts-expect-error
      const total = Date.parse(data?.start_date) - Date.parse(new Date());
      const seconds = addZeroifSingle(Math.floor((total / 1000) % 60));
      const minutes = addZeroifSingle(Math.floor((total / 1000 / 60) % 60));
      const hours = addZeroifSingle(
        Math.floor((total / (1000 * 60 * 60)) % 24)
      );
      const days = addZeroifSingle(Math.floor(total / (1000 * 60 * 60 * 24)));
      const label = "Starting In:";
      return {
        label,
        days,
        hours,
        minutes,
        seconds,
      };
    } else if (
      // @ts-expect-error
      new Date(data?.start_date) < new Date() &&
      // @ts-expect-error
      new Date(data?.end_date) < new Date()
    ) {
      const label = "Ended";
      return {
        label,
      };
    } else if (
      // @ts-expect-error
      new Date(data?.start_date) < new Date() &&
      // @ts-expect-error
      new Date(data?.end_date) > new Date()
    ) {
      // @ts-expect-error
      const total = Date.parse(data?.end_date) - Date.parse(new Date());
      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      const days = Math.floor(total / (1000 * 60 * 60 * 24));
      const label = "Ending In:";
      return {
        label,
        days,
        hours,
        minutes,
        seconds,
      };
    } else {
      const label = "Loading...";
      return { label };
    }
  };

  const [timeLeft, setTimeLeft] = useState(getRemainingTime());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(getRemainingTime());
    }, 1000);
  });

  return (
    <div className="flex flex-col">
      <div>{timeLeft.label}</div>
      {Boolean(timeLeft?.seconds) && (
        <div>
          {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m :{" "}
          {timeLeft.seconds}s
        </div>
      )}
    </div>
  );
};

export default Countdown;
