import React, { Component } from "react";
import { create } from 'ipfs-http-client';
import Select from 'react-select';

const client = create('https://ipfs.infura.io:5001') ///ip4/127.0.0.1/tcp/5001
const auction_Time_Options  = [
    {value: 3600, label: '1 day'},
    {value: 10800, label: '3 day'},
    {value: 604800, label: '1 week'},
    {value: 2629743 , label: '1 month'},
]
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
        selectedOrg: null,
        url: '',
        assetName:null,
        assetDesc:null,
        assetPrice:null,
        bidCheckbox: false,
        bidTime: 0,
        orgs: [], 
        orgNames: [
            {value: '0x000', label: 'Organization need to be added'}
        ],
        
    };
    this.getOrgs();
}

getOrgs = async (e) => {
    let orgNames = [];
    let orgs = await this.state.NFTMarketContract.methods.fetchOrganization()
                    .call({from: this.state.account});
    for(let i=0;i<orgs.length;i++){
        orgNames.push({value: orgs[i].orgAddress, label: orgs[i].name})
    }
    this.setState({orgs: orgs, orgNames: orgNames})
    //console.log(orgs[0].orgAddress)
}

inputHandler = (e) => {
    this.setState({[e.target.name]: e.target.value})
}

orgSelectHandler = (e) => {
    this.setState({bidTime: e.value});
    console.log(e)
}

bidTimeSelectHandler = (e) => {
    this.setState({[e.name]: e.value});
    console.log(e)
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
    let ListingPirce = await this.state.NFTMarketContract.methods.getListingPrice()
        .call({from: this.state.account})
        
    price = this.state.web3.utils.toWei(price, 'ether')
    try{
        await this.state.NFTContract.methods.createToken(url)
            .send({from: this.state.account});

        let id = await this.state.NFTContract.methods.createToken(url)
            .call({from: this.state.account})

            await this.state.NFTMarketContract.methods.createMarketItem(this.state.NFTContractAddress, id-1, price, this.state.selectedOrg, this.state.bidCheckbox, this.state.bidTime)
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

bidCheckboxHandler = (e) => {
    this.setState({bidCheckbox: e.target.checked})
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
                <label><input type="checkbox" name='bidCheckbox' checked={this.state.bidCheckbox} onChange={this.bidCheckboxHandler}/>Bid</label>
                <div>
                    {
                        this.state.bidCheckbox === true
                        ? <Select calssName='biddingTime' options={auction_Time_Options} onChange={this.orgSelectHandler}></Select>
                        : null
                    }
                </div>
                <Select calssName='selectOrgs' options={this.state.orgNames} onChange={this.bidTimeSelectHandler}></Select>
                <p><input type='submit'></input></p>
            </form>
        </div>
    </div>
    );
}
}

export default CreateNFT;
