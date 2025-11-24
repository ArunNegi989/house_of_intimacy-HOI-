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
import ShopByCategory from "./ShopByCategory.jsx";
import NewArrival from "./NewArricalSection.jsx";
import CoolCasualsSection from "./CoolCasualsSection.jsx";




export default function Home() {
  

  return (
    <>
    <CategoryStrip/>
      <Herosection/>
      <NewArrival/>
      <ColorsSelector/>
      <SwimwearSection />
      <Offermarquee/>
      <Bestsellers/>
      <CoolCasualsSection/>
      <BestChoice/>
      <ShopByCategory/>
      <ProductSection/>
      <VideoPlayer/>
      
    </>
  );
}
