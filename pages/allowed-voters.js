import { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import toast from "react-hot-toast";

// INTERNAL IMPORT
import { VotingContext } from "../context/Voter";
import Style from "../styles/allowedVoter.module.css";
import images from "../assets";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import Loader from "../components/Loader";

const AllowedVoters = () => {
  const [fileUrl, setFileUrl] = useState(null);

  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    position: "",
  });

  const router = useRouter();

  const {
    uploadToIPFS,
    createVoter,
    getNewCandidate,
    voterArray,
    loader,
  } = useContext(VotingContext);

  // ================= IMAGE UPLOAD =================

  const onDrop = useCallback(
    async (acceptedFile) => {
      if (!acceptedFile || !acceptedFile[0]) return;

      try {
        toast.loading("Uploading image...", { id: "upload" });

        const url = await uploadToIPFS(acceptedFile[0]);

        if (!url) throw new Error("Upload failed");

        setFileUrl(url);
        toast.success("Image uploaded successfully!", { id: "upload" });

      } catch (err) {
        console.error("Upload Error:", err);
        toast.error("Image upload failed!", { id: "upload" });
      }
    },
    [uploadToIPFS]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 5000000,
  });

  // ================= LOAD VOTERS =================

  useEffect(() => {
    if (getNewCandidate) {
      getNewCandidate();
    }
  }, [getNewCandidate]);

  // ================= VALIDATION =================

  const isValidWallet = (address) =>
    /^0x[a-fA-F0-9]{40}$/.test(address);

  // ================= CREATE VOTER =================

  const handleCreateVoter = async () => {
    if (!formInput.name || !formInput.address || !formInput.position) {
      toast.error("All fields are required.");
      return;
    }

    if (!isValidWallet(formInput.address)) {
      toast.error("Invalid wallet address format.");
      return;
    }

    if (!fileUrl) {
      toast.error("Please upload a profile image.");
      return;
    }

    try {
      const txPromise = createVoter(formInput, fileUrl, router);

      if (!txPromise || typeof txPromise.then !== "function") {
        throw new Error("API did not return a promise");
      }

      await toast.promise(txPromise, {
        loading: "Authorizing voter on blockchain...",
        success: "Voter authorized successfully 🎉",
        error: "Transaction failed. Check wallet & try again.",
      });

      // Reset after success
      setFormInput({
        name: "",
        address: "",
        position: "",
      });
      setFileUrl(null);

    } catch (err) {
      console.error("Create voter error:", err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className={Style.createVoter}>
      {/* LEFT SIDE */}
      <div>
        {fileUrl ? (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="asset_file" />
            <div className={Style.voterInfo_paragraph}>
              <p>Name: <span>{formInput.name || "N/A"}</span></p>
              <p>
                Address:{" "}
                <span>
                  {formInput.address
                    ? formInput.address.slice(0, 20)
                    : "N/A"}
                </span>
              </p>
              <p>Pos: <span>{formInput.position || "N/A"}</span></p>
            </div>
          </div>
        ) : (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              <h4>Create Candidate For Voting</h4>
              <p>
                Blockchain voting organization powered by Ethereum ecosystem.
              </p>
              <p className={Style.sideInfo_para}>
                Contract Candidate List
              </p>
            </div>

            <div className={Style.car}>
              {voterArray?.slice(0, 4).map((el, i) => (
                <div key={i} className={Style.card_box}>
                  <div className={Style.image}>
                    <img src={el?.image} alt="Profile photo" />
                  </div>
                  <div className={Style.card_info}>
                    <p>{el?.name} #{el?.voterID}</p>
                    <p>
                      Address:{" "}
                      {el?.address
                        ? el.address.slice(0, 10) + "..."
                        : "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CENTER */}
      <div className={Style.voter}>
        <div className={Style.voter__container}>
          <h1>Create New Voter</h1>

          <div className={Style.voter__container__box}>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className={Style.voter__container__box__div_info}>
                <p>Upload File: JPG, PNG (Max 5MB)</p>
                <div className={Style.voter__container__box__div__image}>
                  <Image
                    src={images.upload}
                    width={120}
                    height={120}
                    alt="file upload"
                  />
                </div>
                <p>Drag & Drop File</p>
                <p>or Browse media on your device</p>
              </div>
            </div>
          </div>
        </div>

        <div className={Style.input__container}>
          <Input
            inputType="text"
            title="Voter Name"
            placeholder="Enter Name"
            handleClick={(e) =>
              setFormInput({ ...formInput, name: e.target.value })
            }
          />

          <Input
            inputType="text"
            title="Wallet Address"
            placeholder="Enter Wallet Address"
            handleClick={(e) =>
              setFormInput({ ...formInput, address: e.target.value })
            }
          />

          <Input
            inputType="text"
            title="Position"
            placeholder="Enter Position"
            handleClick={(e) =>
              setFormInput({ ...formInput, position: e.target.value })
            }
          />

          <div className={Style.Button}>
            <Button
              btnName={loader ? "Processing..." : "Authorize Voter"}
              handleClick={handleCreateVoter}
            />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={Style.createdVorter}>
        <div className={Style.createdVorter__info}>
          <Image src={images.creator} alt="user profile" />
          <p>Notice</p>
          <p>Organizer <span>0xf39Fd6e51..</span></p>
          <p>
            Only organizer of the voting contract can create voter
            and candidate for election.
          </p>
        </div>
      </div>

      {loader && <Loader />}
    </div>
  );
};

export default AllowedVoters;