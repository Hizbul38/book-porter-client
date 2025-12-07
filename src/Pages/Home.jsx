import React from 'react';
import HeroBanner from '../Components/HeroBanner';
import Coverage from '../Components/Coverage';
import LatestBooks from '../Components/LatestBooks';

const Home = () => {
    return (
        <div>
            <HeroBanner></HeroBanner>
            <LatestBooks></LatestBooks>
            <Coverage></Coverage>
        </div>
    );
};

export default Home;