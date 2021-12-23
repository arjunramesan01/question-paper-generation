import type { NextPage } from 'next'
import Image from 'next/image'
import styles from '../styles/index.module.css'

const Home: NextPage = () => {
  return (
   <>
    <div className={styles.searchBarContainer}>
      <div>
        <h1>Byjus Universal Search</h1>
        <div className={styles.searchBarDiv}>
          <div className={styles.centerAlign}>
            <input className={styles.searchBar} placeholder='Type here...'></input>
          </div>
          <div>
            <div className={styles.centerAlign}>
              <Image src="/images/Search.png" height="50" width="50"></Image>
            </div>
          </div>
        </div>
      </div>
    </div>
   </>
  )
}

export default Home
