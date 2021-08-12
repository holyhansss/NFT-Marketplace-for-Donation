import React, { Component } from "react";

class ReadNFTs extends Component {
  
  constructor(props){
    super(props)
    this.state = {items: [], NFTMarketContract: this.props.NFTMarketContract, account: this.props.account};
    this.handleView()
  }
  
  handleView = async () => {
    let items = await this.state.NFTMarketContract.methods.fetchMarketItems().call({from: this.state.account});
    this.setState({items})
  } 
  
  render() {
      
    return (
        
    <div>
          {
            this.state.items.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <div className="p-4 bg-black">
                    {console.log(nft)}
                    <p >ItemId - {nft.itemId}</p>
                    <p >Price - {nft.price} Wei</p>
                </div>
              </div>
            ))
          }
    </div>
        
    );
  }
}

export default ReadNFTs;
