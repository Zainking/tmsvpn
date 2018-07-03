import React from 'react'

import Header from '../components/Header'
import List from '../components/List'
import NewAccount from '../components/NewAccount'

import styles from './IndexPage.css'

const IndexPage = () => (
  <div className={styles.normal}>
    <Header />
    <main>
      <List />
      <NewAccount />
    </main>
  </div>
);

export default IndexPage
