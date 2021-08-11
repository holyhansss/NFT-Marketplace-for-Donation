import React, { Component } from "react";
import NFTMarket from "./contracts/NFTMarket.json";
import NFT from "./contracts/NFT.json";
import getWeb3 from "./getWeb3";
import ReadNFTs from "./component/ReadNFTs";

import "./App.css";

import {
  nftaddress, nftmarketaddress
} from './config'

class App extends Component {
  state = { mode: 'view', web3: null, accounts: null, NFTContractAddress: '', NFTMarketContract: null, NFTContract: null, totalId: 1, items: []};
  
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      let networkId = await web3.eth.net.getId();
      let deployedNetwork = NFTMarket.networks[networkId];
      const NFTMarketContract = new web3.eth.Contract(
        NFTMarket.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const networkId2 = await web3.eth.net.getId();
      const deployedNetwork2 = NFT.networks[networkId2];
      const NFTContract = new web3.eth.Contract(
        NFT.abi,
        deployedNetwork2 && deployedNetwork2.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, NFTMarketContract, NFTContract});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  
  handleFromOnSubmit = async (e) => {
    e.preventDefault();
    let items = this.state.items;

    let price = e.target.assetPrice.value;
    price = parseInt(price)
    
    let transaction = await this.state.NFTContract.methods.createToken('url').send({from: this.state.accounts[0]});
    let id = await this.state.NFTContract.methods.createToken('url').call({from: this.state.accounts[0]})
    let listingPrice = await this.state.NFTMarketContract.methods.getListingPrice().call({from: this.state.accounts[0]});
    listingPrice = listingPrice+""
    
    let receipt = await this.state.NFTMarketContract.methods.createMarketItem(nftaddress, id-1, price).send( { from: this.state.accounts[0], value : listingPrice})


    let totalId = this.state.totalId + 1;
    this.setState({items, totalId})
  }

  handleView = async () => {
    let items = await this.state.NFTMarketContract.methods.fetchMarketItems().call({from: this.state.accounts[0]});
    //this.setState({items})
    const mapp = items.map((item) => {
      console.log(item.tokenId , item.seller)
    })
  } 
  
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      
      <div className="App">
        <div className="container">
          <form onSubmit={this.handleFromOnSubmit}>
            <p><input type='text' name='assetName' placeholder='Asset Name'></input></p>
            <p><textarea name='assetDesc' placeholder='Asset Description'></textarea></p>
            <p><input type='text' name='assetPrice' placeholder='Asset Price in ETH'></input></p>
            <p><input type='submit'></input></p>
          </form>
          <ReadNFTs NFTMarketContract={this.state.NFTMarketContract}></ReadNFTs>
          <button type='button' onClick={this.handleView}>View NFTs</button>
        </div>
      </div>
    );
  }
}

export default App;
