import React, { Component } from "react";
import "./style/Controller.css"
class Controller extends Component {

  render() {
      
    return (
      <div className="menuBar">
        <ul className="tabs">
          <li onClick={function(e){
              this.props.onChangeMode('create');
          }.bind(this)}>Create</li>
          <li onClick={function(e){
              this.props.onChangeMode('viewNFTMarket');
          }.bind(this)}>NFT Market</li>
          <li onClick={function(e){
              this.props.onChangeMode('viewMyItem');
          }.bind(this)}>View My Item</li>
          <li onClick={function(e){
              this.props.onChangeMode('createNewOrg');
          }.bind(this)}>Create New Organization</li>
        </ul>
      </div>
    );
  }
}

export default Controller;
