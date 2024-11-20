"use client";
import Image from "next/image";
import { useState, CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  backgroundColor: "#0093E9",
  backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
};

const Loader = () => {
  const [color, setColor] = useState("");

  return (
    <div className="sweet-loading">
      <Image
        src="/assets/gifs/loader.gif"
        width={1000}
        height={1000}
        className="w-full  object-cover"
        alt="Loading..."
      />
    </div>
  );
};

export default Loader;
