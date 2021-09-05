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
            OrganizationName: '', 
            OrganizationAddress: '',
        };

    }

    inputHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
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
