import { curve, officeimage } from "../../assets";
import Button from "./Button";
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "../design/Hero";
import { heroIcons } from "../../constants";
import { ScrollParallax } from "react-just-parallax";
import { useRef } from "react";
import Generating from "./Generating";
import Notification from "./Notification";
import CompanyLogos from "./CompanyLogos";

const Hero = () => {
  const parallaxRef = useRef(null);

  return (
    <Section className="pt-[12rem] -mt-[5.25rem]" customPaddings id="hero">
      <div className="container relative" ref={parallaxRef}>
        {/* Title and Description */}
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 mb-6">
            Mirai connects aspiring interns with visionary HR teams. Start
            building the future{" "}
            <span className="inline-block relative">
              today{" "}
              <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-2"
                width={624}
                height={28}
                alt="Curve"
              />
            </span>
          </h1>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
            "Discover a smart space where internships thrive, everything you
            need for success, all in one place"
          </p>
          <Button href="/apply" white>
            Apply for an Internship
          </Button>
        </div>

        {/* Image and Background */}
        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
          <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
            <div className="relative bg-white rounded-[1rem]"> {/* Changed to bg-white */}
              <div className="h-[0.9rem] bg-white rounded-t-[0.9rem]" /> {/* Changed to bg-white */}

              <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
              <img
  src={officeimage}
  className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"

  alt="Office"
/>


                <Generating className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" />

                {/* Hero Icons */}
                <ScrollParallax isAbsolutelyPositioned>
                  <ul className="hidden absolute -left-[5.5rem] bottom-[7.5rem] px-1 py-1 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-2xl xl:flex">
                    {heroIcons.map((icon, index) => (
                      <li className="p-5" key={index}>
                        <img src={icon} width={24} height={25} alt={icon} />
                      </li>
                    ))}
                  </ul>
                </ScrollParallax>

                {/* Notification */}
                <ScrollParallax isAbsolutelyPositioned>
                  <Notification
                    className="hidden absolute -right-[5.5rem] bottom-[11rem] w-[18rem] xl:flex"
                    title="HR team"
                  />
                </ScrollParallax>
              </div>
            </div>

            {/* Gradient */}
            <Gradient />
          </div>

          {/* Background Circles */}
          <BackgroundCircles parallaxRef={parallaxRef} />
        </div>

        {/* Company Logos */}
        <CompanyLogos className="hidden relative z-10 mt-20 lg:block" />
      </div>

      <BottomLine />
    </Section>
  );
};

export default Hero;
