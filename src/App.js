import {useEffect, useState} from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import {ethers} from "ethers";
import abi from './abi.json';
import nftItemABI from './abis/nft_item_abi.json';
import nftMarketplaceABI from './abis/nft_marketplace_abi.json';
import './App.css';


let contractAddress = "0xb6c1c796A580525Af7Ad4474A34a63debE80221c";
let nftItemAddress = "0x3C29ee95B72eAd2E6246d100948Ab2780d1c9671";
let nftMarketplaceAddress = "0xc40cbE61A51cbD0A39FEe26c3EEb301A28C3bdAB";



function ProductPutComponent() {
  const [uriValue, setUriValue] = useState("");
  const [price, setPrice] = useState("5000000000000000000");

  async function requestAccount() {
    await window.ethereum.request({method : "eth_requestAccounts"});
  }

  async function createToken(uri) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const itemContract = new ethers.Contract(nftItemAddress, nftItemABI, signer);
    let transactionCreateToken = await itemContract.createToken(uri);
    setUriValue("");
    setPrice("");
    let transactionResult = await transactionCreateToken.wait();
    console.log("Transaction: TokenID: ", parseInt(transactionResult.events[0].args[2]._hex, 16));
    return parseInt(transactionResult.events[0].args[2]._hex, 16);
  }

  async function listItem(tokenId, price) {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractMarket = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceABI, signer)
      const transactionPutProduct = await contractMarket.createMarketItem(nftItemAddress, tokenId, price, {value : "10000000000000000"});
      await transactionPutProduct.wait();
    }
  }

  async function createTokenAndListItem() {
    let tokenId = await createToken(uriValue);
    await listItem(tokenId, price);
  }


  return (
    <div className = "BuyComponent">
      <input
        className = "BuyComponentInput" 
        onChange = {e => setUriValue(e.target.value)}
        placeholder = "Set URI"
        value = {uriValue}
      />
      <input 
        className = "BuyComponentInput" 
        onChange = {e => setPrice(e.target.value)}
        placeholder = "Set Price"
        value = {price}
      />
      <button className = "BuyComponentButton" onClick = {createTokenAndListItem}>Put Your Item!</button>
    </div>
  )
}

function MarketGallery() {

  const [items, setItems] = useState();

  async function getMarketItems() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nftMarketContract = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceABI, signer);
    try {
      const marketItems = await nftMarketContract.fetchMarketItems();
      console.log(marketItems);
      return marketItems;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMarketItems().then((marketItems) => {

    })
  },[])

  return (
    <div className = "MarketGallery">

    </div>
  )
}

function MarketItemCard(props) {
  //props should include the item id
  const [uri, setUri] = useState("");

  

  async function getURI() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const nftItemContract = new ethers.Contract(nftItemAddress, nftItemABI, provider);
    const uri = await nftItemContract.tokenURI(props.id);
    return uri;
  }

  useEffect(() => {
    getURI().then(fetchedUri => setUri(fetchedUri));

  }, [])

  return (
    <div>
      {uri && <div>{uri}</div>}
      <button>Buy</button>
    </div>
  )
}


function App() {
  const [uriValue, setUriValue] = useState("");
  const [account, setAccount] = useState();

  async function requestAccount() {
    await window.ethereum.request({method : "eth_requestAccounts"});
  }

  async function getMarketBalance() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance("0x8212973BcC0426034ea950E1186Bf50d98fD9f2f");
    console.log("The market balance is: ", balance);
  }


  async function getMarketItems() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nftMarketContract = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceABI, signer);
    try {
      const marketItems = await nftMarketContract.fetchMarketItems();
      console.log(marketItems);
      return marketItems;
    } catch (error) {
      console.log(error);
    }
  }

  async function getAccountDetails() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      console.log(accounts);
      const currentAccount = accounts[0];
      const balance = await provider.getBalance(currentAccount);
      return {account : currentAccount, balance : parseInt(balance._hex, 16) / 1000000000000000000};
    }
  }

  async function fetchURI() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const nftItemContract = new ethers.Contract(nftItemAddress, nftItemABI, provider);
      
      try {
        const fetchedURI = await nftItemContract.tokenURI(10);
        const balance = await provider.listAccounts();
        console.log("The uri is", JSON.stringify(fetchedURI));
        console.log("The balance is:", JSON.stringify(balance[0]));
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
      const transactionPutProduct = await contractMarket.createMarketItem(nftItemAddress, 23, "5000000000000000000" , {value : "10000000000000000"});
      await transactionPutProduct.wait();
    }
  }

  async function buyItem() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractMarket = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceABI, signer)
      const transactionBuyProduct = await contractMarket.createMarketSale(nftItemAddress, 6, {value : "5000000000000000000"});
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
      let transactionResult = await transaction.wait();
      console.log("transaction result:", parseInt(transactionResult.events[0].args[2]._hex, 16));
      fetchURI();//not one
    }
  }

  


  useEffect(() => {
    getAccountDetails().then((accountDetails) => {
      //console.log(accountDetails);
      setAccount(accountDetails);
    });
  }, []);




  return (
    <div className="App">
      <header className = "App-header">
        {account && <div>{account.account}</div>}
      </header>
      
      {/* <MarketItemCard /> */}

      {/* <input 
        onChange = {e => setUriValue(e.target.value)}
        placeholder = "Set URI"
        value = {uriValue}
      /> */}

      <ProductPutComponent />

      <button className = "App-button" onClick = {() => fetchURI(1)}>Fetch URI</button>
      <button className = "App-button" onClick = {setURI}>Set URI</button>
      <button className = "App-button" onClick = {listItem}>List Item</button>
      <button className = "App-button" onClick = {buyItem}>Buy Item</button>
      <button className = "App-button" onClick = {getMarketBalance}>Get Market Balance</button>
      <button className = "App-button" onClick = {getMarketItems}>Get Market Items</button>

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