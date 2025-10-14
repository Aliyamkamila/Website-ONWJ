import React from 'react';

const Komisaris = () => {
  const commissioners = [
    {
      name: 'Lorem Ipsum',
      position: 'President Commissioner',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3',
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.'
    },
    {
      name: 'Dolor Sit',
      position: 'Independent Commissioner',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3',
      description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.'
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Dewan Komisaris
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {commissioners.map((commissioner, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover md:w-48"
                    src={commissioner.image}
                    alt={commissioner.name}
                  />
                </div>
                <div className="p-8">
                  <div className="tracking-wide text-sm text-blue-600 font-semibold">
                    {commissioner.position}
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-gray-800">
                    {commissioner.name}
                  </h3>
                  <p className="mt-3 text-gray-600">
                    {commissioner.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Komisaris;