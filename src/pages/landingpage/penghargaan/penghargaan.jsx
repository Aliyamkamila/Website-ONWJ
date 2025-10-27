import React, { useState, useEffect } from 'react';
import CountUp from './CountUp'; 
import './penghargaan.css';

export default function Penghargaan() {
  const awards = [
    {
      id: 1,
      title: 'Best Innovation Award',
      icon: '🏆',
      description: 'Lorem ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer',
    },
    {
      id: 2,
      title: 'Customer Excellence Award',
      icon: '⭐',
      description: 'Lorem ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer',
    },
    {
      id: 3,
      title: 'Industry Leader Award',
      icon: '👑',
      description: 'Lorem ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer',
    },
  ];

  const statistics = [
    {
      id: 1,
      value: 20,
      suffix: '+',
      label: 'Years Experience',
    },
    {
      id: 2,
      value: 35,
      suffix: '+',
      label: 'Award Win',
    },
    {
      id: 3,
      value: 1750,
      suffix: '+',
      label: 'Happy Customers',
      separator: ',',
    },
    {
      id: 4,
      value: 120,
      suffix: '+',
      label: 'Expert Staffs',
    },
  ];

  return (
    <section className="penghargaan-section" id="awards">
      <div className="penghargaan-wrapper">
        {/* Integrated Header and Cards Layout */}
        <div className="penghargaan-main">
          {/* Left Side - Header with Blue Background */}
          <div className="penghargaan-header">
            <div className="penghargaan-content">
              <h2 className="penghargaan-title">Our Award</h2>
              <p className="penghargaan-description">
                Lorem ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a gallery of type and scrambled it to make a type specimen book.
              </p>
              <button className="penghargaan-button" aria-label="View more awards">
                View More
              </button>
            </div>
          </div>

          {/* Right Side - Award Cards */}
          <div className="penghargaan-grid">
            {awards.map((award, index) => (
              <div 
                key={award.id} 
                className="penghargaan-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="penghargaan-icon" role="img" aria-label={award.title}>
                  {award.icon}
                </div>
                <h3 className="penghargaan-card-title">{award.title}</h3>
                <p className="penghargaan-card-description">{award.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section with CountUp Animation */}
      <div className="statistik-section">
        <div className="statistik-container">
          {statistics.map((stat, index) => (
            <div key={stat.id} className="statistik-card">
              <div className="statistik-number">
                <CountUp
                  to={stat.value}
                  from={0}
                  direction="up"
                  delay={index * 0.2}
                  duration={2}
                  separator={stat.separator || ''}
                  className="statistik-number-value"
                />
                {stat.suffix}
              </div>
              <div className="statistik-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}