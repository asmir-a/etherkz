import {useEffect, useState} from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import {ethers} from "ethers";
import abi from './abi.json';
import nftItemABI from './abis/nft_item_abi.json';
import nftMarketplaceABI from './abis/nft_marketplace_abi.json';


let contractAddress = "0xb6c1c796A580525Af7Ad4474A34a63debE80221c";
let nftItemAddress = "0x3C29ee95B72eAd2E6246d100948Ab2780d1c9671";
let nftMarketplaceAddress = "0xc40cbE61A51cbD0A39FEe26c3EEb301A28C3bdAB";

function App() {
  const [uriValue, setUriValue] = useState("");

  async function requestAccount() {
    await window.ethereum.request({method : "eth_requestAccounts"});
  }

  async function getMarketBalance() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance("0x8212973BcC0426034ea950E1186Bf50d98fD9f2f");
    console.log("The market balance is: ", balance);
  }

  async function fetchURI() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const nftItemContract = new ethers.Contract(nftItemAddress, nftItemABI, provider);
      console.log(nftItemContract);
      try {
        const fetchedURI = await nftItemContract.tokenURI(3);
        console.log("The uri is", JSON.stringify(fetchedURI));
      } catch(err) {
        console.log("Error:", err);
      }
    }
  }

  async function listItem() {
    //if (!uriValue) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractMarket = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceABI, signer)
      const transactionPutProduct = await contractMarket.createMarketItem(nftItemAddress, 3, "5000000000000000000" , {value : "10000000000000000"});
      await transactionPutProduct.wait();
    }
  }

  async function buyItem() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractMarket = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceABI, signer)
      const transactionBuyProduct = await contractMarket.createMarketSale(nftItemAddress, 3, {value : "5000000000000000000"});
      await transactionBuyProduct.wait();
    }
  }

  async function setURI() {
    if (!uriValue) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(nftItemAddress, nftItemABI, signer);
      const transaction = await contract.createToken(uriValue);
      setUriValue("");
      await transaction.wait();
      fetchURI();//not one
    }
  }

  


  useEffect(() => {}, []);




  return (
    <div className="App">
      <input 
        onChange = {e => setUriValue(e.target.value)}
        placeholder = "Set URI"
        value = {uriValue}
      />
      <header className = "App-header">
        <button onClick = {() => fetchURI(1)}>Fetch URI</button>
        <button onClick = {setURI}>Set URI</button>
        <button onClick = {listItem}>List Item</button>
        <button onClick = {buyItem}>Buy Item</button>
        <button onClick = {getMarketBalance}>Get Market Balance</button>
      </header>
    </div>
  );
}

export default App;



const MetaMaskInterface = () => {
  let contractAddress = "0xA8fb9802fD8377FF120c6544b8DdE4a6f2EAc5EE";
  let provider = null;

  useEffect(() => {
    if(typeof window.ethereum !== 'undefined') {
      // Ethereum user detected. You can now use the provider.
      provider = window['ethereum']
      console.log('metamask found');
    }
    provider.enable()
    .then(function (accounts) {
      let ethersProvider = new ethers.providers.Web3Provider(provider);
      let contract = new ethers.Contract(contractAddress, abi, ethersProvider.getSigner());
      console.log(accounts);
      let value = ethers.utils.bigNumberify(Math.pow(10,9)).mul(ethers.utils.bigNumberify(Math.pow(10,9))).mul(ethers.utils.bigNumberify(10));
      let transaction = contract.transfer("0x8abaD0176217D8cF1a9fc9E559D30BfF36269737", value);
      console.log(transaction);
    })
    .catch(function (error) {
      // Handle error. Likely the user rejected the login
      console.error(error)
    })
  });

  return (
    <p>hi</p>
  )
};