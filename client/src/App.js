import React, { Component } from "react";
import NFTMarket from "./contracts/NFTMarket.json";
import NFT from "./contracts/NFT.json";
import getWeb3 from "./getWeb3";

import "./App.css";

import {
  nftaddress, nftmarketaddress
} from './config'

class App extends Component {
  state = { web3: null, accounts: null, NFTContractAddress: '', NFTMarketContract: null, NFTContract: null, totalId: 0, items: []};
  
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
      this.setState({ web3, accounts, NFTContractAddress: deployedNetwork2.address, NFTMarketContract, NFTContract});
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
    items.push({
      id:this.state.totalId, 
      assetName: e.target.assetName.value, 
      assetDesc: e.target.assetDesc.value,
      assetPrice: e.target.assetPrice.value
    })
    let price = e.target.assetPrice.value;
    price = parseFloat(price)


    let listingPrice = await this.state.NFTMarketContract.methods.getListingPrice().call();
    //listingPrice = this.state.web3.utils.fromWei(listingPrice, 'ether')
    console.log(this.state.NFTContract.defaultAccount )
    //console.log(this.state.NFTContractAddress);
    await this.state.NFTMarketContract.methods.createMarketItem(nftaddress,this.state.totalId, price).send( { from: nftaddress})
    let totalId = this.state.totalId + 1;
    this.setState({items, totalId})
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
        
        </div>
      </div>
    );
  }
}

export default App;
