import React, { Component } from "react";
import NFTMarket from "./contracts/NFTMarket.json";
import NFT from "./contracts/NFT.json";

import "./App.css";

import {
  nftaddress, nftmarketaddress
} from './config'

class App extends Component {
  state = {items: []};
  constructor(props){
    super(props)

  }
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
          <button type='button' onClick={this.handleView}>View NFTs</button>

        </div>
      </div>
    );
  }
}

export default App;
