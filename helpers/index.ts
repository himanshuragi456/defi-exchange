export const addZeroifSingle: Function = (input: number) => {
  if (input.toString().length === 1) {
    return `0${input}`;
  } else {
    return input;
  }
};

export const getRemainingTime: Function = (
  startDate: string,
  endDate: string
) => {
  console.log(new Date(startDate).getTime(), new Date(endDate).getTime());
  if (new Date(startDate) > new Date()) {
    // @ts-expect-error
    const total = Date.parse(startDate) - Date.parse(new Date());
    const seconds = addZeroifSingle(Math.floor((total / 1000) % 60));
    const minutes = addZeroifSingle(Math.floor((total / 1000 / 60) % 60));
    const hours = addZeroifSingle(Math.floor((total / (1000 * 60 * 60)) % 24));
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
    new Date(startDate) < new Date() &&
    new Date(endDate) < new Date()
  ) {
    const label = "Ended";
    return {
      label,
    };
  } else if (
    new Date(startDate) < new Date() &&
    new Date(endDate) > new Date()
  ) {
    // @ts-expect-error
    const total = Date.parse(endDate) - Date.parse(new Date());
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
    return null;
  }
};
