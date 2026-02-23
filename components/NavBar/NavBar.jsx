import React, { useState, useContext, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";

// INTERNAL IMPORT
import { VotingContext } from "../../context/Voter";
import Style from "./NavBar.module.css";
import loding from "../../loding.gif";

const NavBar = () => {
  const { connectWallet, error, currentAccount } =
    useContext(VotingContext);

  const [openNav, setOpenNav] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenNav(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shortAddress = (address) =>
    address
      ? address.slice(0, 6) + "..." + address.slice(-4)
      : "";

  return (
    <div className={Style.navbar}>
      {error && (
        <div className={Style.message__Box}>
          <p>{error}</p>
        </div>
      )}

      <div className={Style.navbar_box}>
        {/* LOGO */}
        <div className={Style.title}>
          <Link href="/" passHref>
            <a>
              <Image
                src={loding}
                alt="logo"
                width={90}
                height={80}
                priority
              />
            </a>
          </Link>
        </div>

        {/* CONNECT / ACCOUNT */}
        <div className={Style.connectWrapper} ref={dropdownRef}>
          {currentAccount ? (
            <div className={Style.account}>
              <div
                onClick={() => setOpenNav(!openNav)}
                className={Style.connect_flex}
              >
                <button className={Style.walletBtn}>
                  {shortAddress(currentAccount)}
                </button>
                <span className={Style.icon}>
                  {openNav ? <AiFillUnlock /> : <AiFillLock />}
                </span>
              </div>

              {openNav && (
                <div className={Style.navigation}>
                  <Link href="/">Home</Link>
                  <Link href="/candidate-regisration">
                    Candidate Registration
                  </Link>
                  <Link href="/allowed-voters">
                    Voter Registration
                  </Link>
                  <Link href="/voterList">
                    Voter List
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <button
              className={Style.connectButton}
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;