import React from 'react'

import Header from '../components/Header'
import Info from '../components/Info'
import List from '../components/List'
import NewAccount from '../components/NewAccount'

import styles from './IndexPage.css'

const IndexPage = () => (
  <div className={styles.normal}>
    <Header />
    <main>
      <img className={styles.logo} src={require('../assets/logo.jpeg')} alt="logo" />
      <Info />
      <List />
      <NewAccount />
    </main>
  </div>
);

export default IndexPage
