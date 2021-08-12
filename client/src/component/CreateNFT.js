import React, { Component } from "react";

import "../App.css";

import {
  nftaddress, nftmarketaddress
} from '../config'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {NFTContract: this.props.NFTContract, NFTMarketContract: this.props.NFTMarketContract, account: this.props.account};

  }
  
  handleFromOnSubmit = async (e) => {
    e.preventDefault();
    let price = e.target.assetPrice.value;
    price = parseInt(price)
    
    let transaction = await this.state.NFTContract.methods.createToken('url').send({from: this.state.account});
    let id = await this.state.NFTContract.methods.createToken('url').call({from: this.state.account})
    let listingPrice = await this.state.NFTMarketContract.methods.getListingPrice().call({from: this.state.account});
    listingPrice = listingPrice+""
    
    let receipt = await this.state.NFTMarketContract.methods.createMarketItem(nftaddress, id-1, price).send( { from: this.state.account, value : listingPrice})

  }

  
  render() {

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
