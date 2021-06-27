import {useEffect, useState} from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import {ethers} from "ethers";
import nftItemABI from './abis/nft_item_abi.json';
import nftMarketplaceABI from './abis/nft_marketplace_abi.json';
import { Card, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';




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
    <Card className = "BuyComponent">
      <Card.Title>Place you item for SALE!</Card.Title>
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
      <Button className = "BuyComponentButton" onClick = {createTokenAndListItem}>Put Your Item!</Button>
    </Card>
  )
}

function MarketGallery() {

  const [items, setItems] = useState();
  const [myItemsSelected, setMyItemsSelected] = useState(false);

  function parseMarketItems(arrOuter) {
    let objMarketItems = [];
    arrOuter.forEach((arrInner) => {
      objMarketItems.push({itemId : parseInt(arrInner[0]._hex), price : parseInt(arrInner[5]._hex), seller : arrInner[3]});
    })
    return objMarketItems;
  }

  function parseMyItems(arrOuter) {
    let objMyItems = [];
    arrOuter.forEach((arrInner) => {
      objMyItems.push({itemId : parseInt(arrInner[0]._hex)});
    })
  }

  async function getMarketItems() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nftMarketContract = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceABI, signer);
    try {
      const marketItems = await nftMarketContract.fetchMarketItems();
      setMyItemsSelected(false);
      setItems(parseMarketItems(marketItems));
      //return marketItems;
    } catch (error) {
      console.log(error);
    }
  }

  async function getMyItems() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nftMarketContract = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceABI, signer);
    try {
      const marketItems = await nftMarketContract.fetchMyNFTs();
      setMyItemsSelected(true);
      setItems(parseMarketItems(marketItems));
      //return marketItems;
    } catch (error) {
      console.log(error);
    }
  }

  

  useEffect(() => {
    getMarketItems();
  },[])

  return (
    <div>
      <h2>Market Gallery</h2>
      <Button style = {{margin : "2rem", width : "10vw"}} onClick = {getMyItems}>My Items</Button>
      <Button style = {{margin : "2rem", width : "10vw"}} onClick = {getMarketItems}>Selling Items</Button>
      <div className = "MarketGallery">
        {items && items.map((item) => 
          <MarketItemCard item = {item}/>
        )}
      </div>
    </div>
  )
}

function MarketItemCard(props) {
  //props should include the item id
  const [uri, setUri] = useState("");

  async function getURI() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const nftItemContract = new ethers.Contract(nftItemAddress, nftItemABI, provider);
    const uri = await nftItemContract.tokenURI(props.item.itemId);
    return uri;
  }

  useEffect(() => {
    getURI().then(fetchedUri => setUri(fetchedUri));
  }, [])

  async function buyButtonHandler(itemId) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nftMarketContract = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceABI, signer);
    const transactionBuyProduct = await nftMarketContract.createMarketSale(nftItemAddress, itemId, {value : "5000000000000000000"});
    await transactionBuyProduct.wait();
  }

  return (
    <div>
      {uri && 
        <Card style = {{width : "18rem", margin : "2rem"}}>
            <Card.Img src = {uri}/>
            <Card.Body>
              <Card.Text>
                Item ID : {props.item.itemId}
              </Card.Text>
              <Card.Text>
                Price : {props.item.price} wei
              </Card.Text>
              <Card.Text>
                Seller : {props.item.seller}
              </Card.Text>
              <Card.Text>
                URI : {uri}
              </Card.Text>
              <Button onClick = {() => {buyButtonHandler(props.item.itemId)}}>Buy!</Button>
            </Card.Body>
      </Card>}
    </div>
  )
}


function MyItemCard(props) {
  //props should include the item id
  const [uri, setUri] = useState("");
  async function getURI() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const nftItemContract = new ethers.Contract(nftItemAddress, nftItemABI, provider);
    const uri = await nftItemContract.tokenURI(props.item.itemId);
    return uri;
  }

  useEffect(() => {
    getURI().then(fetchedUri => setUri(fetchedUri));
  }, [])

  async function buyButtonHandler(itemId) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nftMarketContract = new ethers.Contract(nftMarketplaceAddress, nftMarketplaceABI, signer);
    const transactionBuyProduct = await nftMarketContract.createMarketSale(nftItemAddress, itemId, {value : "5000000000000000000"});
    await transactionBuyProduct.wait();
  }

  return (
    <div>
      {uri && 
        <Card style = {{width : "18rem", margin : "2rem"}}>
            <Card.Img src = {uri}/>
            <Card.Body>
              <Card.Text>
                Item ID : {props.item.itemId}
              </Card.Text>
              <Card.Text>
                URI : {uri}
              </Card.Text>
            </Card.Body>
      </Card>}
    </div>
  )
}


function App() {
  const [account, setAccount] = useState();

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

  useEffect(() => {
    getAccountDetails().then((accountDetails) => {
      setAccount(accountDetails);
    });
  }, []);


  return (
    <div className="App">
      <header className = "App-header">
        <h3>Your Account Address: </h3>
        {account && <div>{account.account}</div>}
        <h3>Your Account Balance: </h3>
        {account && <div>{account.balance}</div>}
      </header>
      <ProductPutComponent />
      <MarketGallery />
    </div>
  );
}

export default App;

