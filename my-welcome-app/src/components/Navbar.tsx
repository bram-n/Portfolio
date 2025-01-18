import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/portfolio?direct=true', label: 'Projects' },
    { path: '/contact', label: 'Contact' },
    { path: '/portfolio#about', label: 'About' }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-24 flex justify-center items-center px-8 bg-transparent z-50">
        {/* Navigation */}
        <div className="flex space-x-16">
          {navItems.map((item) => (
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
          ))}
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