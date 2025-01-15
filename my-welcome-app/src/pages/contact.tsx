import { useState } from 'react';
import Navbar from '../components/Navbar';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-white">
      <Navbar />
      <div className="container mx-auto px-8 pt-32">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300">
          Contact
        </h1>
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#112240] border border-[#233554] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-100"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#112240] border border-[#233554] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-100"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 bg-[#112240] border border-[#233554] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-100 resize-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-transparent border-2 border-cyan-400 text-cyan-400 rounded-lg font-medium 
                       hover:bg-cyan-400/10 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0a192f]"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 