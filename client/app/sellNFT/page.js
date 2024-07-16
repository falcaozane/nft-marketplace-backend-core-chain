"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/utils/pinata";
import marketplace from "@/app/marketplace.json";
import { ethers } from "ethers";
import { WalletContext } from "@/context/wallet";
import { toast } from "react-toastify";

export default function SellNFT() {
  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [fileURL, setFileURL] = useState();
  const [message, updateMessage] = useState("");
  const [btn, setBtn] = useState(false);
  const [btnContent, setBtnContent] = useState("List NFT");
  const router = useRouter();
  const { isConnected, signer } = useContext(WalletContext);

  async function onFileChange(e) {
    try {
      const file = e.target.files[0];
      const fileType = file.type;

      // Check if the file is a valid image type (jpeg, jpg, png)
      const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validImageTypes.includes(fileType)) {
        updateMessage("Please upload a valid image file (JPEG, JPG, PNG).");
        toast.error("Please upload a valid image file (JPEG, JPG, PNG).")
        return;
      }

      const data = new FormData();
      data.set("file", file);
      setBtn(false);
      updateMessage("Uploading image... Please don't click anything!");
      const response = await uploadFileToIPFS(data);
      if (response.success === true) {
        setBtn(true);
        updateMessage("");
        setFileURL(response.pinataURL);
      }
    } catch (e) {
      console.log("Error during file upload...", e);
      toast.error("Error during file upload...")
    }
  }

  async function uploadMetadataToIPFS() {
    const { name, description, price } = formParams;
    if (!name || !description || !price || !fileURL) {
      updateMessage("Please fill all the fields!");
      return -1;
    }

    const nftJSON = {
      name,
      description,
      price,
      image: fileURL,
    };

    try {
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        return response.pinataURL;
      }
    } catch (e) {
      console.log("Error uploading JSON metadata: ", e);
    }
  }

  async function listNFT(e) {
    try {
      setBtnContent("Processing...");
      const metadataURL = await uploadMetadataToIPFS();
      if (metadataURL === -1) return;

      updateMessage("Uploading NFT...Please dont click anythying!");
      //toast.warning("Uploading NFT...Please dont click anythying!")

      let contract = new ethers.Contract(
        marketplace.address,
        marketplace.abi,
        signer
      );
      const price = ethers.parseEther(formParams.price);

      let transaction = await contract.createToken(metadataURL, price);
      await transaction.wait();

      setBtnContent("List NFT");
      setBtn(false);
      updateMessage("");
      updateFormParams({ name: "", description: "", price: "" });
      toast.success("Successfully listed your NFT!");
      //alert("Successfully listed your NFT!");
      router.push("/marketplace");
    } catch (e) {
      alert("Upload error", e);
      toast.error("Didn't Mint NFT")
      router.push("/profile");
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-3">
      {isConnected ? (
        <div className="flex flex-col items-center justify-center flex-grow">
          <h2 className="font-bold text-xl my-2 py-5 ">List and Sell your NFT</h2>
          <div className="bg-white w-full max-w-lg p-8 shadow-2xl rounded-lg my-5">
            <h2 className="text-4xl text-orange-600 mb-8 text-center uppercase font-extrabold">Upload your NFT</h2>
            <div className="mb-6">
              <label className="block text-left text-lg font-bold mb-2 text-orange-600">
                NFT name <span className="text-red-600 text-base">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 text-base bg-gray-50 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formParams.name}
                onChange={(e) =>
                  updateFormParams({ ...formParams, name: e.target.value })
                }
              />
            </div>
            <div className="mb-6">
              <label className="block text-left text-lg font-bold mb-2 text-orange-600">
                NFT description <span className="text-red-600 text-base">*</span>
              </label>
              <textarea
                className="w-full px-4 py-2 text-base bg-gray-50 text-gray-700 border border-gray-300 rounded-lg h-20 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formParams.description}
                onChange={(e) =>
                  updateFormParams({
                    ...formParams,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-6">
              <label className="block text-left text-lg font-bold mb-2 text-orange-600">
                Price (in tCORE) <span className="text-red-600 text-base">*</span>
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 text-base bg-gray-50 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formParams.price}
                onChange={(e) =>
                  updateFormParams({ ...formParams, price: e.target.value })
                }
              />
            </div>
            <div className="mb-6">
              <label className="block text-left text-lg font-bold mb-2 text-orange-600">
                Upload image <span className="text-red-600 text-base">*</span>
              </label>
              <input
                type="file"
                className="w-full px-4 py-2 text-base bg-gray-50 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={onFileChange}
                required
              />
            </div>
            <div className="text-red-600 font-medium text-center my-4">{message}</div>
            <button
              onClick={listNFT}
              type="submit"
              className={`border-none rounded-lg w-full py-3 px-6 flex items-center justify-center text-lg font-bold transition-colors ${
                btn ? "bg-orange-600 text-white cursor-pointer hover:bg-orange-700" : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
            >
              {btnContent === "Processing..." && (
                <span className="inline-block border-4 border-gray-300 border-l-white rounded-full mr-2 w-6 h-6 animate-spin" />
              )}
              {btnContent}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="text-4xl font-bold text-red-600 max-w-6xl mx-auto mb-20 p-4">
            Connect Your Wallet to Continue...
          </div>
        </div>
      )}
    </div>
  );
}
