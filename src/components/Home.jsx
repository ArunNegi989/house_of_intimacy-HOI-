import React, { useState } from "react";
import SwimwearSection from "../components/Swimwear.jsx";
import Herosection from "./Herosection.jsx";
import Offermarquee from "./Offermarquee.jsx";
import Bestsellers from "./Bestsellers.jsx";
import ProductSection from "./Productsection.jsx";
import BestChoice from "./BestChoice.jsx";
import ColorsSelector from "./ColorsSelector.jsx";
import VideoPlayer from "./VideoPlayer.jsx";
import CategoryStrip from "./CategoryStrip.jsx";




export default function Home() {
  

  return (
    <>
    <CategoryStrip/>
      <Herosection/>
      <ColorsSelector/>
      <SwimwearSection />
      <Offermarquee/>
      <Bestsellers/>
      <BestChoice/>
      <ProductSection/>
      <VideoPlayer/>
      
    </>
  );
}
