import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Contact from "../Components/Contact"
import "swiper/swiper-bundle.css";
//import 'swiper/css/bundle'
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

//  import './Listing.css';

// import required modules
import { Navigation } from "swiper/modules";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";

const ListingPage = () => {
  const [listing, setListing] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
console.log(currentUser._id);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/list/get/${params.id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        console.log(res.data.data);
        setListing(res.data.data);

        setLoading(false);
        setError(false);
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.id]);
  return (
    <>
      <div>
        {listing && listing.imageUrls && listing.imageUrls.length > 0 && (
          <div style={{ backgroundSize: "cover" }}>
            <img
              src={listing.imageUrls[0]}
              className="h-[550px]"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "550px",
              }}
              alt="Listing"
            />
          </div>
        )}
      </div>
      {listing && (
        <>
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name}-${""}
              {listing.offer ? listing.discountprice : listing.regularprice}
              {listing.type === "rent" && " / month"}
            </p>
            <p className=" flex items-center mt-6 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className=" bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "for Rent " : "For Sale"}
              </p>
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description -</span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg " />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}{" "}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser && listing.useRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                contact land lord
              </button>
            )}
            {
              contact && <Contact listing={listing} />
            }
          </div>
        </>
      )}
    </>
  );
};

export default ListingPage;
