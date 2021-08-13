import React, { Component } from "react";
import styles from "./css/Header.css"

class Header extends Component {
  
  constructor(props){
    super(props)

  }

  
  render() {
      
    return (
        
    <header className={styles.header}>
        <div className={styles.contents}>
          <div>
            로고 자리
          </div>
  
          <nav className={styles.navigation}>
            <ul>
              <li>
                메뉴 1
              </li>
              <li>
                메뉴 2
              </li>
            </ul>
          </nav>
        </div>
    </header>
        
    );
  }
}

export default Header;
