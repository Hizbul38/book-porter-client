import React from 'react';
import HeroBanner from '../Components/HeroBanner';
import Coverage from '../Components/Coverage';
import LatestBooks from '../Components/LatestBooks';
import WhyChooseUs from '../Components/WhyChooseUs';

const Home = () => {
    return (
        <div>
            <HeroBanner></HeroBanner>
            <LatestBooks></LatestBooks>
            <Coverage></Coverage>
            <WhyChooseUs></WhyChooseUs>
        </div>
    );
};

export default Home;