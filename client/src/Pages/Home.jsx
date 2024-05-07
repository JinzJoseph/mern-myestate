import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListCard from "../Components/ListCard";

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferData = async () => {
      try {
        const res = await axios.get("/api/list/get?offer=true&limit=4");
        setOfferListings(res.data);
        fetchRentData();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentData = async () => {
      try {
        const res = await axios.get("/api/list/get?type=rent&limit=4");

        setRentListings(res.data);
        fetchSaleData();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleData = async () => {
      try {
        const res = await axios.get("/api/list/get?type=sale&limit=4");

        setSaleListings(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferData();
  }, []);

  return (
    <div>
      {/* top section */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Sahand Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>
      {/* image Section */}
      <div className="w-full">
        <img
          src="https://www.shutterstock.com/image-photo/property-taxes-real-estate-market-260nw-1700575657.jpg"
          alt="image"
          className="w-full"
          style={{
            backgroundSize: "cover",
          }}
        />
      </div>

      {/* offer section card */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
          {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        </div>
      {/* rent section cards */}

      {/* sale section card */}
    </div>
  );
};

export default Home;
