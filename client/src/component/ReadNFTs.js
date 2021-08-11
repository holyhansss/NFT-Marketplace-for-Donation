import React, { Component } from "react";

class ReadNFTs extends Component {
  
  constructor(props){
    super(props)
    this.state = {item: null, NFTMarketContract: this.props.NFTMarketContract, account: this.props.account};
    
  }

  handleView = async () => {
    let items = await this.state.NFTMarketContract.methods.fetchMarketItems().call({from: this.state.account});
    let mapp = items.map((item) => (
      <li key={item.tokenId}>{item.tokenId}</li>
    ))
    return mapp
  } 
  
  render() {
    return (
       
            <ul>{}</ul>
            
        
    );
  }
}

export default ReadNFTs;
