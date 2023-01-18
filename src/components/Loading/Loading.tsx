import * as React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import "./Loading.scss";

export default function Loading() {
  return (
    <div className="loading-container">
      <Player
        src="https://assets3.lottiefiles.com/packages/lf20_gbfwtkzw.json"
        className="player"
        loop
        autoplay
      />
    </div>
  );
}
