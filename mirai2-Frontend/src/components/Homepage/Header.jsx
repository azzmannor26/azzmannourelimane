import { Link, useLocation } from "react-router-dom"; // Import Link for routing
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import logo from "../../assets/Login/logo1.png"; // Update the path as needed
import { navigation } from "../../constants";
import Button from "./Button";
import MenuSvg from "../../assets/svg/MenuSvg";
import { HamburgerMenu } from "../design/Header";
import { useState } from "react";

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 ${
        openNavigation
          ? "bg-n-8/50 backdrop-blur-md"
          : "bg-n-8/20 backdrop-blur-sm"
      }`}
    >
      {/* Header container */}
      <div className="flex items-center justify-start px-3 lg:px-5 xl:px-7 max-lg:py-6 h-20">
        {/* Logo */}
        <Link className="block xl:mr-8" to="/">
          <img
            src={logo}
            width={150} // Adjust the width (smaller than 190)
            height={30} // Adjust the height (smaller than 40)
            alt="MiraiLogo"
            className="object-contain h-20 w-auto" // Ensures the logo maintains aspect ratio
          />
        </Link>

        {/* Navigation */}
        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8/50 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row lg:ml-4">
            {navigation.map((item) => (
              <Link
                key={item.id}
                to={item.url}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-black transition-colors hover:text-transparent focus:text-transparent ${
                  item.onlyMobile ? "lg:hidden" : ""
                } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold lg:leading-5 xl:px-12`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          <HamburgerMenu />
        </nav>

        {/* Login Button */}
        <Link className="hidden lg:flex ml-4" to="/login">
          <Button>Login</Button>
        </Link>

        {/* Hamburger Menu */}
        <Button
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
