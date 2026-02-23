import React from "react";
import Style from "../card/card.module.css";
import voterCardStyle from "./voterCard.module.css";

const VoterCard = ({ voterArray }) => {
  const shortenAddress = (address) => {
    if (!address) return "N/A";
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  return (
    <div className={Style.card}>
      {voterArray?.map((el, i) => (
        <div key={i} className={Style.card_box}>
          {/* ================= IMAGE ================= */}
          <div className={Style.image}>
            <img
              src={el?.image || "/fallback.png"}
              alt="Profile"
            />
          </div>

          {/* ================= INFO ================= */}
          <div className={Style.card_info}>
            <h2>
              {el?.name || "Unnamed"} #{el?.voterID}
            </h2>

            <p className={voterCardStyle.wallet}>
              {shortenAddress(el?.address)}
            </p>

            <p className={voterCardStyle.description}>
              Verified blockchain voter registered in the smart contract.
            </p>

            {/* ================= STATUS BADGE ================= */}
            <p
              className={`${voterCardStyle.vote_Status} ${
                el?.votingStatus
                  ? voterCardStyle.voted
                  : voterCardStyle.not_voted
              }`}
            >
              {el?.votingStatus
                ? "✔ Already Voted"
                : "⏳ Not Voted Yet"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VoterCard;