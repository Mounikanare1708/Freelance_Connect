import { Users, Target, Shield, Zap, Heart, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  const stats = [
    { label: 'Active Users', value: '10K+', icon: Users },
    { label: 'Gigs Completed', value: '25K+', icon: Zap },
    { label: 'Satisfaction Rate', value: '99%', icon: Heart },
    { label: 'Awards Won', value: '12', icon: Award },
  ];

  const values = [
    {
      title: 'Trust & Safety',
      description: 'Your security is our top priority. We implement strict verification processes for all users.',
      icon: Shield,
    },
    {
      title: 'Our Mission',
      description: 'Empowering students and local talent by providing a secure platform for micro-task opportunities.',
      icon: Target,
    },
    {
      title: 'Quality First',
      description: 'We ensure high standards of work through our community-driven review and rating system.',
      icon: Award,
    },
  ];

  return (
    <div className="pt-20 pb-16">
      {/* Hero Section */}
      <section className="container-app mb-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
          >
            Revolutionizing the <span className="text-gradient">Freelance</span> Marketplace
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg leading-relaxed"
          >
            Freelance Connect was born from a simple idea: making it easier for students and local communities 
            to collaborate on micro-tasks and grow their professional skills in a safe, modern environment.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-surface-card border-y border-surface-border py-16 mb-24">
        <div className="container-app">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4 border border-primary-500/20">
                  <stat.icon className="w-6 h-6 text-primary-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container-app mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Our Core Values</h2>
          <p className="text-gray-400">The principles that guide everything we do.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, idx) => (
            <div key={idx} className="card hover:border-primary-500/30 transition-all p-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center mb-6">
                <value.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team/Story Section */}
      <section className="container-app">
        <div className="bg-surface-card rounded-[2rem] border border-surface-border p-8 md:p-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px] -mr-32 -mt-32"></div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  Founded in 2024, Freelance Connect started as a small university project aimed at helping students 
                  monetize their skills. We quickly realized the potential for a broader marketplace that served 
                  local communities.
                </p>
                <p>
                  Today, we are proud to be one of the fastest-growing micro-task platforms, connecting thousands 
                  of talented individuals with businesses and individuals who need their expertise.
                </p>
                <p>
                  Our journey is just beginning, and we continue to innovate, ensuring that Freelance Connect 
                  remains the most trusted platform for the modern gig economy.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-3xl bg-surface-elevated border border-surface-border overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400" alt="Team" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-3xl bg-surface-elevated border border-surface-border overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400" alt="Office" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="aspect-square rounded-3xl bg-surface-elevated border border-surface-border overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400" alt="Meeting" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-3xl bg-surface-elevated border border-surface-border overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400" alt="Work" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
