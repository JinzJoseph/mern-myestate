import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signout";
import Profile from "./Pages/Profile";
import About from "./Pages/About";
import Header from "./Components/Header";
import PrivateRoute from "./Components/PrivateRoute";
import CreateListing from "./Pages/CreateListing";
import EditListinh from "./Pages/EditListinh";
import ListingPage from "./Pages/ListingPage";
function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/Signup" element={<Signup />}></Route>
        <Route element={ <PrivateRoute/>}>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/create-listing" element={<CreateListing/>}></Route>
        <Route path="/update-listing/:id" element={<EditListinh/>}></Route>
        <Route path="/listing/:id" element={<ListingPage/>}></Route>
        </Route>
      
        <Route path="/About" element={<About />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
