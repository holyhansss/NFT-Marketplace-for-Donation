import React, { Component } from "react";
import NFTMarket from "./contracts/NFTMarket.json";
import NFT from "./contracts/NFT.json";
import getWeb3 from "./getWeb3";
import ReadNFTs from "./component/ReadNFTs";
import CreateNFTs from "./component/CreateNFT";

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
  


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      
      <div className="App">
        <div className="container">
          <CreateNFTs NFTContract={this.state.NFTContract} NFTMarketContract={this.state.NFTMarketContract} account={this.state.accounts[0]}></CreateNFTs>
          <ReadNFTs NFTMarketContract={this.state.NFTMarketContract} account={this.state.accounts[0]}></ReadNFTs>
        </div>
      </div>
    );
  }
}

export default App;
