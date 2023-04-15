import { ethers } from "ethers";
import { createContext, useEffect, useState } from "react";
import { contractABI, contactAddress } from "../utils/connect";

export const TransactionContext = createContext();

const { ethereum } = window;
// eslint-disable-next-line
const getSmartContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const daiContract = new ethers.Contract(contactAddress, contractABI, signer);
    console.log(provider, signer, daiContract);
    return daiContract;
};

export const TransactionProvider = ({ children }) => {
    // eslint-disable-next-line
    const [currentAccount, setCurrentAccount] = useState("");
    const [inputFormData, setInputFormData] = useState({
        addressTo: "", amount: "",
    })
    const handleChange = (e, name) => {
        setInputFormData((prevInputFormData) => ({
            ...prevInputFormData,
            [name]: e.target.value,
        }));
    };

    const checkMetaMask = async () => {
        if (!ethereum) return alert("install please");

        const accounts = await ethereum.request({ method: "eth_accounts" });
        console.log(accounts);
    }

    const connectWallet = async () => {
        if (!ethereum) return alert("install please");

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log(accounts[0]);

        setCurrentAccount(accounts[0]);
    };

    const sendTransaction = async () => {
        if (!ethereum) return alert("install please");

        console.log("sendTransaction");

        const transactionContract = getSmartContract();
        const parsedAmount = ethers.utils.parseEther(inputFormData.amount);

        const transactionParameters = {
            to: inputFormData.addressTo, // Required except during contract publications.
            from: currentAccount, // must match user's active address.
            value: parsedAmount._hex, // Only required to send ether to the recipient from the initiating external account.
        };

        await ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });

        const transactionHash = await transactionContract.addToBlockChain(inputFormData.addressTo, parsedAmount);
        console.log("...^^");
        await transactionHash.wait();
        console.log("...^^...end");
    };

    useEffect(() => { checkMetaMask(); }, []);
    // eslint-disable-next-line
    return (<TransactionContext.Provider value={{ connectWallet, sendTransaction, handleChange, inputFormData }}>{children}</TransactionContext.Provider>);
};