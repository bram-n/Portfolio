import { motion } from 'framer-motion';

export const AboutSection = () => {
  return (
    <section id="about" className="w-full py-16 md:py-24 bg-gradient-to-b from-[#112240]/50 to-[#0a192f]/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full max-w-[1800px] mx-auto px-6 sm:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-6">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-sm font-mono text-cyan-400 block"
              >
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]"
              >
                About Me
              </motion.h1>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-8 text-xl leading-relaxed text-gray-300/90"
            >
              <p className="font-light">
                Hello, I'm Bram! 👋 
              </p>
              <p className="font-light">
              I'm a senior Economics and Computer Science Major at Macalester College.
              </p>
              <p className="font-light">
              I'm currently a Economics TA at Macalester College (2022-Present). Previously, I was an intern at BrightAI (2023-2025).
              </p>
              <p className="font-light">
                I enjoy coding in Python, Java, SQL, and React.
                I am also familiar with C and Stata and am currently learning R and Matlab.
              </p>
              <p className="font-light">
                In my spare time I like to read, golf, hike, and play the violin.
              </p>
              <div className="pt-10">
                <motion.a 
                  href="/contact"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center px-8 py-4 text-xl text-cyan-400 hover:text-cyan-300 transition-all duration-300 ease-in-out border border-cyan-400 hover:border-cyan-300 rounded-md hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] bg-[#112240]/30 hover:bg-[#112240]/50"
                >
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-200">▶</span> 
                  Get in touch
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Image Container */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:col-span-5 pt-20 md:pt-20"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-cyan-400/20 rounded-lg transform translate-x-4 translate-y-4 -z-10 transition-transform duration-300 group-hover:translate-x-5 group-hover:translate-y-5" />
              <div className="relative aspect-[4/5] w-full bg-[#112240]/80 rounded-lg overflow-hidden border-2 border-cyan-400/20 transition-colors duration-300 group-hover:border-cyan-400/40">
              <img 
                  src="/IMG_8239.png"
                  alt="Picture"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center text-gray-500/80">
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}; 