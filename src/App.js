import {useEffect, useState} from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import {ethers} from "ethers";
import abi from './abi.json';
import nftItemABI from './abis/nft_item_abi.json';
import nftMarketplaceABI from './abis/nft_marketplace_abi.json';

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

function App() {
  // const [contract, setContract] = useState("");
  let contractAddress = "0xb6c1c796A580525Af7Ad4474A34a63debE80221c";
  let nftItemAddress = "0xbdbB1A5e58A70BAFc9a255eeb335ebFdd3E203F6";
  let nftMarketplaceAddress = "0xab3Bd4B108002aa291b37775a5d655616424bD21";
  let provider = null;

  let createToken = null;
  let tokenURI = null;

  function handleCreateTokenButton() {
    
  }

  useEffect(() => {
    if(typeof window.ethereum !== 'undefined') {
      // Ethereum user detected. You can now use the provider.
      provider = window.ethereum;
    }
    provider.enable()
    .then(function (accounts) {
      let ethersProvider = new ethers.providers.Web3Provider(provider);
      console.log(accounts);
      
      let contract = new ethers.Contract(contractAddress, abi, ethersProvider.getSigner());
      let nftMarketplaceContract = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceABI, ethersProvider.getSigner());
      let nftItemContract = new ethers.Contract(nftItemAddress, nftItemABI, ethersProvider.getSigner());
      
      console.log("React Contract: ", contract);
      console.log("Market Contract", nftMarketplaceContract);
      console.log("Item Contract", nftItemContract);

      const {createToken, tokenURI} = nftItemContract;

      tokenURI(10).then(result => console.log("The result", result));

      const {getSecret} = contract;
      getSecret().then((secret) => console.log(secret));
    })
    .catch(function (error) {
      // Handle error. Likely the user rejected the login
      console.error(error)
    }, [])

    //getAccounts();
    // MetaMaskInterface();

  },[]);



  return (
    <div className="App">
    </div>
  );
}

export default App;
