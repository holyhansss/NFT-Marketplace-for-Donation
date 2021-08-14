import React, { Component } from "react";
import NFTMarket from "./contracts/NFTMarket.json";
import NFT from "./contracts/NFT.json";
import getWeb3 from "./getWeb3";
import ViewNFTMarket from "./component/ViewNFTMarket";
import CreateNFTs from "./component/CreateNFT";
import Controller from "./component/Controller";
//import Header from "./component/Header";
import "./App.css";
import MyNFTs from "./component/MyNFTs";

class App extends Component {
  state = { 
     mode: 'viewNFTMarket',
     web3: null,
     accounts: null, 
     NFTContractAddress: '',
     NFTMarketContractAddress: '', 
     NFTMarketContract: null, 
     NFTContract: null, 
     totalId: 1, 
     items: []
    };
  
  constructor(props) {
    super(props)
    this.initWbe3();
  }

  initWbe3 = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = NFTMarket.networks[networkId];
      const NFTMarketContract = new web3.eth.Contract(
        NFTMarket.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const networkId2 = await web3.eth.net.getId();
      const deployedNetwork2 = NFT.networks[networkId2];
      const NFTContract = new web3.eth.Contract(
        NFT.abi,
        deployedNetwork2 && deployedNetwork2.address,
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      this.setState(
        { web3, 
          accounts, 
          NFTMarketContract, 
          NFTContract, 
          NFTContractAddress: deployedNetwork2.address, 
          NFTMarketContractAddress: deployedNetwork.address
        });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }
  getContents = () =>{
    let _contents;
    if(this.state.mode === 'viewNFTMarket'){
      _contents = 
      <ViewNFTMarket 
        web3 = {this.state.web3}
        NFTContract={this.state.NFTContract} 
        NFTMarketContract={this.state.NFTMarketContract}
        NFTContractAddress={this.state.NFTContractAddress}
        account={this.state.accounts[0]
      }></ViewNFTMarket>
    }else if(this.state.mode === 'create'){
      _contents =  
      <CreateNFTs
        web3 = {this.state.web3}
        NFTContract={this.state.NFTContract} 
        NFTMarketContract={this.state.NFTMarketContract} 
        NFTContractAddress={this.state.NFTContractAddress}
        account={this.state.accounts[0]}
      ></CreateNFTs>
    } else if(this.state.mode === 'viewMyItem'){
      _contents = 
      <MyNFTs 
        NFTContract={this.state.NFTContract} 
        NFTMarketContract={this.state.NFTMarketContract}
        NFTContractAddress={this.state.NFTContractAddress}
        account={this.state.accounts[0]
      }></MyNFTs>
    }
    return _contents;
  }
  onChangeMode = (_mode) => {
    this.setState({mode: _mode})
    console.log(_mode)
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div>
        <div>
          <Controller onChangeMode={(_mode) => this.onChangeMode(_mode)}></Controller>
        </div>
        <div className="App">
          <div className="container">
            {this.getContents()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
