import React from 'react';

const Direksi = () => {
  const directors = [
    {
      name: 'Consectetur Adipiscing',
      position: 'Chief Executive Officer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.'
    },
    {
      name: 'Sed Do Eiusmod',
      position: 'Chief Operating Officer',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3',
      description: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem.'
    },
    {
      name: 'Tempor Incididunt',
      position: 'Chief Financial Officer',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3',
      description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.'
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Dewan Direksi
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {directors.map((director, index) => (
            <div key={index} className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-1 aspect-h-1">
                <img
                  className="w-full h-64 object-cover"
                  src={director.image}
                  alt={director.name}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {director.name}
                </h3>
                <p className="text-blue-600 font-medium mt-1">
                  {director.position}
                </p>
                <p className="mt-4 text-gray-600">
                  {director.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Direksi;