import React from 'react';
import Herosection from '../../components/Homepagecomopents/Herosection.jsx';
import Offermarquee from '../../components/Homepagecomopents/Offermarquee.jsx';
import VideoPlayer from '../../components/Homepagecomopents/VideoPlayer.jsx';
import CategoryStrip from '../../components/Homepagecomopents/CategoryStrip.jsx';
import ShopByCategory from '../../components/Homepagecomopents/ShopByCategory.jsx';
import NewArrival from '../../components/Homepagecomopents/NewArricalSection.jsx';
import JockeyColorSlider from '../../components/Homepagecomopents/JockeyColorSlider.jsx';
import BlogCards from '../../components/Homepagecomopents/Blogs.jsx';
import { Vamikadetails } from './Vamikadetails.jsx';
import { Reviewssection } from './Reviews.jsx';
import ProductSection from './Productsection.jsx';

export default function Home() {
  return (
    <>
      <CategoryStrip />
      <Herosection />
      <NewArrival />
      <Offermarquee />
      <JockeyColorSlider />
      <ShopByCategory />
      <Vamikadetails />
      <ProductSection />
      <BlogCards />
      <Reviewssection />
      <VideoPlayer />
    </>
  );
}
