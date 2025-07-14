import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'

import Customize from '../components/Customize'
import Collection from '../components/GenderCollection'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection/>
      <BestSeller/>
      <Collection/>
      {/* <Customize/> */}
      <OurPolicy/>
      
    </div>
  )
}

export default Home
