import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const navHeight = 96; // Height of the navbar
      const aboutPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({
        top: aboutPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleAboutClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (currentPath !== '/portfolio') {
      await router.push('/portfolio');
      // Wait for page transition and DOM update
      setTimeout(scrollToAbout, 500);
    } else {
      scrollToAbout();
    }
  };

  useEffect(() => {
    // Handle initial load with hash
    if (router.asPath === '/portfolio#about') {
      setTimeout(scrollToAbout, 500);
    }
  }, [router.asPath]);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/portfolio?direct=true', label: 'Projects' },
    { path: '#about', label: 'About', onClick: handleAboutClick },
    { path: '/contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full h-24 flex justify-center items-center px-8 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'}`}>
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-16">
          {navItems.map((item) => (
            item.onClick ? (
              <a
                key={item.path}
                href={item.path}
                onClick={item.onClick}
                className={`group relative flex flex-col items-center transition-all duration-300
                  ${currentPath === '/portfolio' && item.path === '#about' ? 'text-cyan-400' : 'text-gray-400'}`}
              >
                <span className="tracking-widest text-sm font-medium uppercase relative pl-3 font-['Montserrat']">
                  <div className="absolute -left-2 top-0 w-0.5 h-0 bg-gradient-to-b from-cyan-400 via-cyan-300 to-teal-300 group-hover:h-full transition-all duration-300 opacity-0 group-hover:opacity-100 blur-[2px]"></div>
                  <div className="absolute -left-2 top-0 w-0.5 h-0 bg-gradient-to-b from-cyan-400 via-cyan-300 to-teal-300 group-hover:h-full transition-all duration-300 opacity-0 group-hover:opacity-70"></div>
                  {item.label}
                </span>
              </a>
            ) : (
              <Link
                key={item.path}
                href={item.path}
                className={`group relative flex flex-col items-center transition-all duration-300
                  ${currentPath === item.path.split('?')[0] ? 'text-cyan-400' : 'text-gray-400'}`}
              >
                <span className="tracking-widest text-sm font-medium uppercase relative pl-3 font-['Montserrat']">
                  <div className="absolute -left-2 top-0 w-0.5 h-0 bg-gradient-to-b from-cyan-400 via-cyan-300 to-teal-300 group-hover:h-full transition-all duration-300 opacity-0 group-hover:opacity-100 blur-[2px]"></div>
                  <div className="absolute -left-2 top-0 w-0.5 h-0 bg-gradient-to-b from-cyan-400 via-cyan-300 to-teal-300 group-hover:h-full transition-all duration-300 opacity-0 group-hover:opacity-70"></div>
                  {item.label}
                </span>
              </Link>
            )
          ))}
        </div>

        {/* Hamburger Menu Button */}
        <button 
          className="md:hidden text-gray-400 hover:text-cyan-400 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="space-y-2">
            <span className={`block w-8 h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
            <span className={`block w-8 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-8 h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
          </div>
        </button>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed inset-0 bg-black/95 backdrop-blur-sm z-40 transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} style={{ top: '96px' }}>
          <div className="flex flex-col items-center space-y-8 pt-8">
            {navItems.map((item) => (
              item.onClick ? (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={item.onClick}
                  className={`group relative flex flex-col items-center transition-all duration-300
                    ${currentPath === '/portfolio' && item.path === '#about' ? 'text-cyan-400' : 'text-gray-400'}`}
                >
                  <span className="tracking-widest text-lg font-medium uppercase relative pl-3 font-['Montserrat']">
                    {item.label}
                  </span>
                </a>
              ) : (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`group relative flex flex-col items-center transition-all duration-300
                    ${currentPath === item.path.split('?')[0] ? 'text-cyan-400' : 'text-gray-400'}`}
                >
                  <span className="tracking-widest text-lg font-medium uppercase relative pl-3 font-['Montserrat']">
                    {item.label}
                  </span>
                </Link>
              )
            ))}
          </div>
        </div>
      </nav>

      {/* Social Links - Fixed to bottom right */}
      <div className="fixed bottom-8 right-8 flex flex-row items-center space-x-4 z-50">
        <a
          href="https://github.com/bram-n"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-cyan-400 transition-colors relative group"
        >
          <div className="w-6 h-6 relative">
            <Image
              src="/github.png"
              alt="GitHub"
              fill
              className="object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
            />
          </div>
          <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 group-hover:w-full transition-all duration-300 -translate-x-1/2 opacity-0 group-hover:opacity-100 blur-[2px]"></div>
          <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 group-hover:w-full transition-all duration-300 -translate-x-1/2 opacity-0 group-hover:opacity-70"></div>
        </a>
        <a
          href="https://www.linkedin.com/in/abraham-nutt/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-cyan-400 transition-colors relative group"
        >
          <div className="w-6 h-6 relative">
            <Image
              src="/linkedin.png"
              alt="LinkedIn"
              fill
              className="object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
            />
          </div>
          <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 group-hover:w-full transition-all duration-300 -translate-x-1/2 opacity-0 group-hover:opacity-100 blur-[2px]"></div>
          <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 group-hover:w-full transition-all duration-300 -translate-x-1/2 opacity-0 group-hover:opacity-70"></div>
        </a>
      </div>
    </>
  );
};

export default Navbar; 