import React, { Component } from "react";

class ReadNFTs extends Component {
  
  constructor(props){
    super(props)
    this.state = {item: null, NFTMarketContract: this.props.NFTMarketContract};
  }

  handleView = async () => {
    let items = await this.state.NFTMarketContract.methods.fetchMarketItems().call({from: this.state.accounts[0]});
    const mapp = items.map((item) => {
        return(<il>{item}</il>);
    })
    this.setState({item: mapp})
  } 
  
  render() {
    return (
       <ul>{this.state.item}</ul>
    );
  }
}

export default ReadNFTs;
