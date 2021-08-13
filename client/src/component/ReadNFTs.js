import React, { Component } from "react";
import axios from "axios";

class ReadNFTs extends Component {
  
  constructor(props){
    super(props)
    this.state = {
        loaded: false,
        nfts: [], 
        NFTContract: this.props.NFTContract,
        NFTMarketContract: this.props.NFTMarketContract, 
        account: this.props.account
    };

    this.LoadNft()
  }
  
  LoadNft = async () => {
    const that = this;
    let data = await this.state.NFTMarketContract.methods.fetchMarketItems().call({from: this.state.account});    
    const nfts = Promise.all(data.map( async i => {
        const TokenUri = await this.state.NFTContract.methods.tokenURI(i.tokenId).call({from: this.state.account})
        const meta = await axios.get(TokenUri)
        let nft = {
            price: i.price,
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.assetName,
            description: meta.data.assetDesc,
        }
        return nft
    })).then(function(result) {
        that.setState({nfts: result, loaded: true})
    })
  } 
  
  render() {
    if (this.state.loaded === false && !this.state.nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)

    else return (
    <div>
        <div className="flex justify-center">
            <div className="px-4" style={{ maxWidth: '1600px' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {
                    this.state.nfts.map((nft, i) => (
                    <div key={i} className="border shadow rounded-xl overflow-hidden">
                        <img src={nft.image} width="300"/>
                        <div className="p-4">
                            <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                            <div style={{ height: '70px', overflow: 'hidden' }}>
                                <p className="text-gray-400">{nft.description}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-black">
                            <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
                            <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded">Buy</button>
                        </div>
                    </div>
                    ))
                }
                </div>
            </div>
        </div>
    </div>
        
    );
  }
}

export default ReadNFTs;
