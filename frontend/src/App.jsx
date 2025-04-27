import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/layout/Layout";
import Explore from "./pages/Explore";
import StoreDetails from "./pages/StoreDetails";

function App() {
  return (
    <>
      <Routes>
        <Route
          path='/'
          element={<Layout />}
        >
          <Route
            path='/'
            element={<Home />}
          />
          <Route
            path='explore'
            element={<Explore />}
          />
          <Route
            path='explore/city/:cityName'
            element={<Explore />}
          />
          <Route
            path='store/:id'
            element={<StoreDetails />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
