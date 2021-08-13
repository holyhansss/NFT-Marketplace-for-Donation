import React, { Component } from "react";
import axios from "axios";
import { create } from 'ipfs-http-client';

import {
    nftaddress, nftmarketaddress
  } from '../config'

const client = create('https://ipfs.infura.io:5001') ///ip4/127.0.0.1/tcp/5001

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

    this.loadNft()
  }
  
  loadNft = async () => {
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
// problem
  buyNFT = async (nft) => {
      let price = nft.price
      console.log(price)
      console.log(this.state.account)
      try{
        await this.state.NFTMarketContract.methods.createMarketSale(nftaddress, nft.tokenId)
            .send({from: this.state.account, value: price})
      }catch(error){
          console.log('buy Failed')
      }
    
        //.then(this.loadNft())
        
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

export default ReadNFTs;
