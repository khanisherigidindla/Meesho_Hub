import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMail, FiUser, FiMessageSquare, FiMapPin, FiPhone } from 'react-icons/fi';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 mb-4 sm:mb-6 shadow-2xl">
            <FiMail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
            Contact Us - Meesho_HUb Warehouse
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Have questions? We'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-4 sm:space-y-6"
          >
            <div className="card">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                Developer Contact
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Name</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Khanish Erigidindla</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FiMail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">khanishram@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <FiPhone className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">9392997308</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <FiMapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
                Hub Location
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                28-3-378, Sri Lakshmi Nagar Road,<br />
                Kisan Nagar, Ram Nagar,<br />
                Nellore, Andhra Pradesh<br />
                524002
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                <FiMessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
                  <div>
                    <label className="label text-xs sm:text-sm">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="input-field py-2 sm:py-3 text-sm sm:text-base"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="label text-xs sm:text-sm">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="input-field py-2 sm:py-3 text-sm sm:text-base"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label text-xs sm:text-sm">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="input-field py-2 sm:py-3 text-sm sm:text-base"
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div>
                  <label className="label text-xs sm:text-sm">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    className="input-field resize-none py-2 sm:py-3 text-sm sm:text-base"
                    placeholder="Your message..."
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-primary flex items-center gap-2 py-2 sm:py-3 text-sm sm:text-base"
                >
                  <FiSend className="w-3 h-3 sm:w-4 sm:h-4" />
                  {submitted ? 'Message Sent!' : 'Send Message'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;