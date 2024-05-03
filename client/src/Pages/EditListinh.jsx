import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "axios";
import { app } from "../Firebase/Firebase";
import { useSelector } from "react-redux";
import { useParams,useNavigate } from "react-router-dom";

const EditListinh = () => {
  const params=useParams()
  const [files, SetFiles] = useState([]);
const { currentUser}=useSelector((state)=>state.user)
  const [imageUrls, setImageUrls] = useState([]);
  //console.log(imageUrls);
  const navigate=useNavigate()
  const [formData, setFormData] = useState({

    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularprice: 10,
    discountprice: 5,
    offer: false,
    parking: false,
    furnished: false,
  });
  //   console.log(files);
  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length < 7) {
      const promise = [];
      for (let i = 0; i < files.length; i++) {
        promise.push(storeImage(files[i]));
      }
      Promise.all(promise).then((urls) => {
        setImageUrls(urls);
      });
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setImageUrls((prevImageUrls) =>
      prevImageUrls.filter((_, i) => i !== index)
    );
  };
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (imageUrls.length < 1) {
        return console.log("you must upload at least one image");
      }
      if (+formData.regularprice < +formData.discountprice) {
        return console.log("discounted price must be lower than regular price");
      }
      const result = await axios.post(
        `/api/list/updatelist/${params.id}`,
        {
            ...formData,useRef:currentUser._id,imageUrls
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(result);
      if (result.data.success === false) {
        console.log(result.data.message);
      }else{
        navigate(`/listing/${result.data._id}`);
       // console.log(result.data);
      }
    } catch (error) {
        console.log(result.data);
    }
  };
  useEffect(()=>{
    const fetchingData=async()=>{
      const id=params.id
      const res=await axios.get(`/api/list/get/${id}`)
      console.log(res);
      if(res.success===false){
        console.log(res.message);
        return
      }
      else{
       // console.log(res);
        setFormData(res.data.data)
        setImageUrls(res.data.data.imageUrls)
      }
    }
    fetchingData()
  },[])
  return (
    <div className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        {" "}
        Update a Listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col sm:flex-row gap-4"
      >
        <div className=" flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg "
            id="name"
            maxLength="63"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg "
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg "
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className=" flex gap-5 flex-wrap">
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="sale"
                className="w-4"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>sell</span>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="rent"
                className="w-4"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="parking"
                className="w-4"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>parking spot</span>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
                className="w-4"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="offer"
                className="w-4"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className=" flex gap-5 flex-wrap">
            <div className=" flex items-center gap-3">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className=" flex items-center gap-3">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className=" flex items-center gap-3">
              <input
                type="number"
                id="regularprice"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularprice}
              />
              <div className=" flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($/Month)</span>
              </div>
            </div>
            {
                formData.offer && (
                    <div className=" flex items-center gap-3">
                    <input
                      type="number"
                      id="discountprice"
                      min="1"
                      max="10"
                      required
                      onChange={handleChange}
                      value={formData.discountprice}
                      className="p-3 border border-gray-300 rounded-lg"
                    />
                    <div className="flex flex-col items-center">
                      <p>Discounted Price</p>
                      <span className="text-xs">($/Month)</span>
                    </div>
                  </div>
                )
            }
           
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The First image will be the cover (max 6)
            </span>
          </p>
          <div className=" flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => SetFiles(e.target.files)}
            />
            <button
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-70"
            >
              Upload
            </button>
          </div>
          {imageUrls.length > 0 &&
            imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-40 h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            type="submit"
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-55"
          >
            Update Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditListinh;
