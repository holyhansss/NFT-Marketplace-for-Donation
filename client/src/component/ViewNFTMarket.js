import React, { Component } from "react";
import axios from "axios";

class ViewNFTMarket extends Component {
  
  constructor(props){
    super(props)
    this.state = {
        loaded: false,
        nfts: [], 
        web3: this.props.web3,
        NFTContract: this.props.NFTContract,
        NFTContractAddress: this.props.NFTContractAddress,
        NFTMarketContract: this.props.NFTMarketContract, 
        account: this.props.account
    };

    this.loadNft()
  }
  
  loadNft = async () => {
    const that = this;
    let data = await this.state.NFTMarketContract.methods.fetchMarketItems().call({from: this.state.account});    
    Promise.all(data.map( async i => {
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
// problem
  buyNFT = async (nft) => {
      let price = nft.price
      //price = parseInt(price)
      //price = this.state.web3.utils.toWei(price, 'ether')
      console.log(price)
      console.log(nft.tokenId)
      try{
        await this.state.NFTMarketContract.methods.createMarketSale(this.state.NFTContractAddress, nft.tokenId)
            .send({value: price, from: this.state.account })
      }catch(error){
          console.log('buy Failed')
      }
    
        //.then(this.loadNft())
        
  }
  render() {
    if (this.state.nfts.length === 0) return (
    
    <h1 className="px-20 py-10 text-3xl">No items in marketplace or Loading...</h1>)

    else return (
    <div>
        <div className="flex justify-center">
            <div className="px-4" style={{ maxWidth: '1600px' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {
                    this.state.nfts.map((nft, i) => (
                    <div key={i} className="border shadow rounded-xl overflow-hidden">
                        <img alt={nft.name} src={nft.image} width="300"/>
                        <div className="p-4">
                            <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                            <div style={{ height: '70px', overflow: 'hidden' }}>
                                <p className="text-gray-400">{nft.description}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-black">
                            <p className="text-2xl mb-4 font-bold text-white">{this.state.web3.utils.fromWei(nft.price, 'ether')} ETH</p>
                            <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => this.buyNFT(nft)}>Buy</button>
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

export default ViewNFTMarket;
