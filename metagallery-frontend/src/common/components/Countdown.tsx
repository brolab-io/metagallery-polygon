"use client";
import { useEffect, useState } from "react";

type Props = {
  unixTime: number;
};

const Countdown = ({ unixTime }: Props) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = unixTime - now;
      if (timeLeft <= 0) {
        setIsExpired(true);
        clearInterval(interval);
      }
      setTimeLeft(timeLeft);
    }, 1000);
    return () => clearInterval(interval);
  }, [unixTime]);

  if (isExpired) {
    return (
      <span>
        00 day
        <br />
        00:00:00
      </span>
    );
  }

  const days = Math.floor(timeLeft / 86400)
    .toString()
    .padStart(2, "0");
  const hours = Math.floor((timeLeft % 86400) / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((timeLeft % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(timeLeft % 60)
    .toString()
    .padStart(2, "0");

  return (
    <span>
      {days} {days === "01" ? "day" : "days"}
      <br />
      {hours}:{minutes}:{seconds}
    </span>
  );
};

export default Countdown;
