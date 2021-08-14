import React, { Component } from "react";

class Controller extends Component {


  
  render() {
      
    return (
      <ul>
        <li onClick={function(e){
            e.preventDefault();
            this.props.onChangeMode('create');
        }.bind(this)}>Create</li>
        <li onClick={function(e){
            e.preventDefault();
            this.props.onChangeMode('viewNFTMarket');
        }.bind(this)}>NFT Market</li>
        <li onClick={function(e){
            e.preventDefault();
            this.props.onChangeMode('viewMyItem');
        }.bind(this)}>View My Item</li>
      </ul>
    );
  }
}

export default Controller;
