import ButtonGradient from "../assets/svg/ButtonGradient";
import Cards from "../components/Homepage/Cards";
import Collaboration from "../components/Homepage/Collaboration";
import Footer from "../components/Homepage/Footer";
import Header from "../components/Homepage/Header";
import Hero from "../components/Homepage/Hero";
import Features from "../components/Homepage/Features";
import "../index.css" //this one should stay here to not apply global style for other

const Home = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Cards />
        <Collaboration />
        <Features />
        <Footer />
      </div>

      <ButtonGradient />
    </>
  );
};

export default Home;
