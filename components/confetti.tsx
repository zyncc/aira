"use client";

import React from "react";
import Confetti from "react-confetti";

export default function ConfettiDecor() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <>
      {mounted && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={300}
          recycle={false}
        />
      )}
    </>
  );
}
