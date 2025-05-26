import HeroSectionImg from "./HeroSectionImg";
import Categories from "./Categories";
import NewArrivals from "./NewArrivals";
import BestSellers from "./BestSellers";
import PromoBanner from "./PromoBanner";
import InstagramFeed from "./InstagramFeed";
import MediaBlock from "./MediaBlock";

const HomePage = () => {
  return (
    <>
      <HeroSectionImg />
      <Categories />
      <NewArrivals />
      <PromoBanner />
      <BestSellers />
      <InstagramFeed />
      <MediaBlock />
    </>
  );
};

export default HomePage;
