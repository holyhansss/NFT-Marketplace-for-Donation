import React, { Component } from "react";

class CreateNewOrg extends Component {
    
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
    CreateOrg = async () => {

    }

    render() {

        return (
        <div className="App">
            <div className="container">
            <form onSubmit={this.CreateOrg}>
                <p><input type='text' name='OrganizationName' placeholder='Organization Name' onChange={this.inputHandler}></input></p>
                <p><input name='OrganizationAddress' placeholder='Organization Address' onChange={this.inputHandler}></input></p>
                <p><input type='submit'></input></p>
            </form>
            </div>
        </div>
        );
    }
}

export default CreateNewOrg;
