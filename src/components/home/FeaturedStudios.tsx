import React from 'react';

const FeaturedStudios = async () => {
  const res = await fetch("http://localhost:5000/featured");
  const resData= await res.json()
  
  return (
    <div>

    </div>
  );
};

export default FeaturedStudios;
