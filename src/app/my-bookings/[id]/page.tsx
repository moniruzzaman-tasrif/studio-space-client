
import React from 'react';


const MyBookingPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const {id} = await params;
  console.log(id);
  const res = await fetch(
    `http://localhost:5000/bookings/${id}`,
  );
  const data = await res.json()
  console.log(data)
  return <div>
{id}
      </div>;
};

export default MyBookingPage;
