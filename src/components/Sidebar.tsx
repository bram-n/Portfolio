import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, FolderKanban, Mail, User, Github, Linkedin } from 'lucide-react';

const Sidebar = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  const [activeSection, setActiveSection] = useState<'projects' | 'about' | null>(null);

  useEffect(() => {
    if (currentPath === '/portfolio') {
      // Initialize projects as active by default on portfolio page
      setActiveSection('projects');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Only update if a section becomes visible
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id as 'projects' | 'about');
            }
          });
        },
        {
          threshold: 0.2, // Reduced threshold to make detection more sensitive
          rootMargin: '-10% 0px -10% 0px' // Add some margin to improve detection
        }
      );

      // Observe both sections
      const projectsSection = document.getElementById('projects');
      const aboutSection = document.getElementById('about');

      if (projectsSection) observer.observe(projectsSection);
      if (aboutSection) observer.observe(aboutSection);

      return () => {
        if (projectsSection) observer.unobserve(projectsSection);
        if (aboutSection) observer.unobserve(aboutSection);
      };
    } else {
      setActiveSection(null);
    }
  }, [currentPath]);

  const isActive = (path: string) => {
    if (currentPath === '/portfolio') {
      if (path.includes('#about')) {
        return activeSection === 'about';
      }
      // Modified to ensure projects section is active by default
      if (path.includes('portfolio')) {
        return activeSection === 'projects' || activeSection === null;
      }
    }
    return currentPath === path.split('?')[0];
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/');
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentPath === '/portfolio') {
      const aboutSection = document.getElementById('about');
      aboutSection?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/portfolio#about');
    }
  };

  const navItems = [
    { 
      path: '/', 
      icon: Home, 
      label: 'Home',
      onClick: handleHomeClick 
    },
    { path: '/portfolio?direct=true', icon: FolderKanban, label: 'Projects' },
    { 
        path: '/portfolio#about', 
        icon: User, 
        label: 'About',
        onClick: handleAboutClick 
      },
    { path: '/contact', icon: Mail, label: 'Contact' }
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-16 flex flex-col 
                    bg-[#112240]/80 backdrop-blur-sm border-r border-cyan-400/10 z-[9999]">
      {/* Navigation Links */}
      <div className="flex-1">
        <div className="flex flex-col items-center gap-8 py-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={item.onClick}
              className={`group relative p-3 rounded-xl transition-all duration-300 hover:bg-cyan-400/10
                ${isActive(item.path) ? 'text-cyan-400' : 'text-gray-400'}
                pointer-events-auto`}
            >
              <item.icon 
                size={24} 
                className="transition-all duration-300 group-hover:text-cyan-400"
              />
              <div className="absolute left-14 px-2 py-1 bg-[#112240] rounded-md 
                            border border-cyan-400/20 text-cyan-400 text-sm whitespace-nowrap
                            opacity-0 invisible group-hover:opacity-100 group-hover:visible
                            transition-all duration-300">
                {item.label}
              </div>
              {isActive(item.path) && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 
                              bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 
                              rounded-full blur-[1px]" />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <a
          href="https://github.com/bram-n"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative p-3 rounded-xl transition-all duration-300 hover:bg-cyan-400/10 text-gray-400"
        >
          <Github 
            size={24} 
            className="transition-all duration-300 group-hover:text-cyan-400"
          />
          <div className="absolute left-14 px-2 py-1 bg-[#112240] rounded-md 
                        border border-cyan-400/20 text-cyan-400 text-sm
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible
                        transition-all duration-300">
            GitHub
          </div>
        </a>
        <a
          href="https://www.linkedin.com/in/abraham-nutt/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative p-3 rounded-xl transition-all duration-300 hover:bg-cyan-400/10 text-gray-400"
        >
          <Linkedin 
            size={24} 
            className="transition-all duration-300 group-hover:text-cyan-400"
          />
          <div className="absolute left-14 px-2 py-1 bg-[#112240] rounded-md 
                        border border-cyan-400/20 text-cyan-400 text-sm
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible
                        transition-all duration-300">
            LinkedIn
          </div>
        </a>
      </div>
    </div>
  );
};

export default Sidebar; 