import {useEffect, useState} from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import {ethers} from "ethers";
import abi from './abi.json';

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
  let contractAddress = "0x63DB8621A04471FcaBe07aE4c26AF8DD442F59e8";
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
      console.log(accounts);
      
      let contract = new ethers.Contract(contractAddress, abi, ethersProvider.getSigner());
      console.log(contract);
      const {getSecret} = contract;
      getSecret().then((secret) => console.log(secret));
      // let value = ethers.utils.bigNumberify(Math.pow(10,9)).mul(ethers.utils.bigNumberify(Math.pow(10,9))).mul(ethers.utils.bigNumberify(10));
      // let transaction = contract.transfer("0x8abaD0176217D8cF1a9fc9E559D30BfF36269737", value);
      // console.log(transaction);
    })
    .catch(function (error) {
      // Handle error. Likely the user rejected the login
      console.error(error)
    })

    //getAccounts();
    // MetaMaskInterface();

  },[]);



  return (
    <div className="App">
    </div>
  );
}

export default App;
