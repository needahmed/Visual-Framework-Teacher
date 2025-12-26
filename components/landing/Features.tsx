'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Zap, Server, Shield, Filter, Database, MousePointer2 } from 'lucide-react';

const features = [
  {
    title: 'Visual Programming',
    description: 'Drag and drop NestJS components. Watch as real boilerplate code is generated instantly in your virtual project.',
    icon: <MousePointer2 className="w-6 h-6 text-cyan-400" />,
    color: 'cyan'
  },
  {
    title: 'Request Lifecycle Live',
    description: 'Trigger simulated requests and watch data packets travel through Guards, Pipes, and Interceptors in a live animation.',
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    color: 'amber'
  },
  {
    title: 'Architect Mode',
    description: 'Visualize complex distributed systems. Map microservice transporters like NATS and Redis with a single click.',
    icon: <Server className="w-6 h-6 text-indigo-400" />,
    color: 'indigo'
  },
  {
    title: 'Database Insights',
    description: 'Model your persistence layer visually. Automatic relationship detection for TypeORM entities with labeled schema mapping.',
    icon: <Database className="w-6 h-6 text-emerald-400" />,
    color: 'emerald'
  },
  {
    title: 'Interactive Curriculum',
    description: '12+ comprehensive lessons taking you from Root Module basics to advanced production-ready design patterns.',
    icon: <Share2 className="w-6 h-6 text-blue-400" />,
    color: 'blue'
  },
  {
    title: 'Real-time Validation',
    description: 'Instant feedback on your architectural decisions. Our engine validates your code against NestJS best practices.',
    icon: <Shield className="w-6 h-6 text-rose-400" />,
    color: 'rose'
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-24 bg-[#020617] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Supercharged for Systems.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to master NestJS architecture in one visual playground.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-cyan-500/5"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
