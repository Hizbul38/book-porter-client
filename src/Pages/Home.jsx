import React from 'react';
import HeroBanner from '../Components/HeroBanner';
import Coverage from '../Components/Coverage';
import LatestBooks from '../Components/LatestBooks';
import WhyChooseUs from '../Components/WhyChooseUs';
import AnimatedStats from '../Components/AnimatedStats';

const Home = () => {
    return (
        <div>
            <HeroBanner></HeroBanner>
            <LatestBooks></LatestBooks>
            <Coverage></Coverage>
            <WhyChooseUs></WhyChooseUs>
            <AnimatedStats></AnimatedStats>
        </div>
    );
};

export default Home;