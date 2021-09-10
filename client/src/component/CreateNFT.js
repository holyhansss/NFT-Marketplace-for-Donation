import React, { Component } from "react";
import { create } from 'ipfs-http-client';

const client = create('https://ipfs.infura.io:5001') ///ip4/127.0.0.1/tcp/5001

class CreateNFT extends Component {
    
  constructor(props){
    super(props)
    
    this.state = {
        web3: this.props.web3,
        NFTContract: this.props.NFTContract, 
        NFTContractAddress: this.props.NFTContractAddress,
        NFTMarketContract: this.props.NFTMarketContract, 
        account: this.props.account,
        selectedFile: null,
        url: '',
        assetName:null,
        assetDesc:null,
        assetPrice:null,
        sellCheckbox: false,
    };

  }
  inputHandler = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  CreateItemData = async (e) => {
        e.preventDefault();
        const {assetName, assetDesc, assetPrice, url} = this.state

        if(!assetName || !assetDesc|| !assetPrice|| !url) return

        const data = JSON.stringify({
            assetName, assetDesc, image: url
        })
        
        try{
            const added = await client.add(data)
            const dataUrl = `https://ipfs.infura.io/ipfs/${added.path}`
            this.createItem(dataUrl)
        }catch(error){
            console.log('Error uploading data: ', error)
            return
        }
    }

    createItem = async (url) => {
        let price = this.state.assetPrice;
        let ListingPirce = this.state.NFTMarketContract.methods.getListingPrice()
            .call({from: this.state.account})
        price = this.state.web3.utils.toWei(price, 'ether')
        console.log(price)
        try{
            await this.state.NFTContract.methods.createToken(url)
                .send({from: this.state.account});
            let id = await this.state.NFTContract.methods.createToken(url)
                .call({from: this.state.account})
                console.log("this")

            await this.state.NFTMarketContract.methods.createMarketItem(this.state.NFTContractAddress, id-1, price)
                .send({ from: this.state.account, value: ListingPirce})
            alert('Create Success')
        }catch(error){
            alert('Create Failed')
        }
        
    }

    onFileChange = async (e) => {
        e.preventDefault();
        const file = e.target.files[0]
        try{
            const added = await client.add(file)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            this.setState({url})
        }catch(error){
            console.log('Error uploading file: ', error)
        }
    }
    
    sellCheckboxHandler = (e) => {
        this.setState({sellCheckbox: e.target.checked})
    }

    render() {

        return (
        <div className="App">
            <div className="container">
            <form onSubmit={this.CreateItemData}>
                <p><input type='text' name='assetName' placeholder='Asset Name' onChange={this.inputHandler}></input></p>
                <p><textarea name='assetDesc' placeholder='Asset Description' onChange={this.inputHandler}></textarea></p>
                <p><input type='text' name='assetPrice' placeholder='Asset Price in ETH' onChange={this.inputHandler}></input></p>
                <p><input type='file' onChange={this.onFileChange}></input></p>
                <p><select name="orgs"></select></p>
                <label><input type="checkbox" name='sellCheckbox' checked={this.state.sellCheckbox} onChange={this.sellCheckboxHandler}/>Sell Immediately</label>
                <p><input type='submit'></input></p>
            </form>
            </div>
        </div>
        );
    }
}

export default CreateNFT;
