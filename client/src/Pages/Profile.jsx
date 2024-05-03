import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../Firebase/Firebase";
import {
  updatedUserStart,
  updatedUserSuccess,
  updatedUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutStart,
  signOutFailure,
  signoutSuccess,
} from "../../redux/user/userSlice";
import axios from "axios";
import { Link } from "react-router-dom";

const Profile = () => {
  const [userListing, SetUserListing] = useState([]);
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const [fileUploadError, setFileUploadError] = useState(false);
  const [filePerc, setFilePerc] = useState(0);
  // console.log(fileperc);
  const [image, SetImage] = useState({});
  const [username, SetUsername] = useState("");
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  // console.log(image);
  const handleImageClick = () => {
    fileRef.current.click();
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          // setFormData({ ...formData, avathar: downloadURL })
          SetImage({ ...image, avathar: downloadURL })
        );
      }
    );
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updatedUserStart());
      const result = await axios.post(
        `/api/user/update/${currentUser._id}`,
        { username, email, password, image },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(result.data); // Access data directly without calling .json()
      if (result.data.success === false) {
        dispatch(updatedUserFailure(result.data.message));
      } else {
        dispatch(updatedUserSuccess(result.data));
        console.log(result.data);
      }
    } catch (error) {
      dispatch(updatedUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(`/api/user/delete/${currentUser._id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      //console.log(res.message);
      //const data = await res.json();
      if (res.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(res));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signoutStart());
      const res = await axios.get("/api/auth/signout", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.success === false) {
        dispatch(signOutFailure(res.message));
        return;
      }
      dispatch(signoutSuccess(res));
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };
  const handleShowListings = async () => {
    try {
      const res = await axios.get(`/api/user/userlist/${currentUser._id}`);
      if (res.success === false) {
        console.log("somethign is wromng");
      }
      const listings = res.data.data;
      console.log(res.data.data);
      SetUserListing(listings);
    } catch (error) {
      console.log(error);
    }
  };
  const handleListingDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/list/delete/${id}`);
      if (res.success === false) {
        console.log(res.message);
        return;
      }
      SetUserListing((prev) => prev.filter((listing) => listing._id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold my-6">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex items-center justify-center">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            ref={fileRef}
            onChange={handleFileInputChange}
          />
          <img
            onClick={handleImageClick}
            className="rounded-full h-24 w-24 object-cover cursor-pointer"
            src={image.avathar || currentUser.avathar}
            alt="profile"
          />
        </div>
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser?.username}
          onChange={(e) => {
            SetUsername(e.target.value);
          }}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser?.email}
          onChange={(e) => {
            SetEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={(e) => {
            SetPassword(e.target.value);
          }}
        />
        <button
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-55"
        >
          Update
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-80"
          to={"/create-listing"}
        >
          create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign out
        </span>
      </div>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show listings
      </button>
      {userListing && userListing.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            your Listing
          </h1>
          {userListing.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
