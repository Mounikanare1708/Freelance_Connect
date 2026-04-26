import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    {
      title: 'Email Us',
      value: 'lourdhumounikanare@gmail.com',
      icon: Mail,
      link: 'mailto:lourdhumounikanare@gmail.com',
    },
    {
      title: 'Call Us',
      value: '+91 9347663680',
      icon: Phone,
      link: 'tel:+919347663680',
    },
    {
      title: 'Visit Us',
      value: 'Mogalirajpuram, Vijayawada',
      icon: MapPin,
      link: 'https://www.google.com/maps/search/Mogalirajpuram,+Vijayawada',
    },
    {
      title: 'Live Chat',
      value: 'Available 24/7',
      icon: MessageCircle,
      link: '#',
    },
  ];

  return (
    <div className="pt-20 pb-16">
      <div className="container-app">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Have questions? We're here to help. Send us a message and our team will respond within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {contactInfo.map((info, idx) => (
              <a 
                key={idx} 
                href={info.link}
                className="card p-6 flex items-start gap-4 hover:border-primary-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20 group-hover:bg-primary-500/20">
                  <info.icon className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{info.title}</h3>
                  <p className="text-sm text-gray-400 group-hover:text-primary-400 transition-colors">
                    {info.value}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card p-8 md:p-10 border-primary-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[80px] -mr-32 -mt-32"></div>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com"
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="How can we help?"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us more about your inquiry..."
                    className="input min-h-[150px] resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-primary w-full md:w-auto px-8 py-4 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-16 card h-[400px] overflow-hidden p-0 border-surface-border">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15303.88248554904!2d80.62767095!3d16.5029019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35ef00a0000001%3A0x673434606138d616!2sMogalirajpuram%2C%20Vijayawada%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1641391234567!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            className="grayscale invert opacity-60"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
