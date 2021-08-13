import React, { Component } from "react";

class Controller extends Component {
  
  constructor(props){
    super(props)

  }

  
  render() {
      
    return (
      <ul>
        <li onClick={function(e){
            e.preventDefault();
            this.props.onChangeMode('create');
        }.bind(this)}>Create</li>
        <li onClick={function(e){
            e.preventDefault();
            this.props.onChangeMode('view');
        }.bind(this)}>View</li>
      </ul>
    );
  }
}

export default Controller;
