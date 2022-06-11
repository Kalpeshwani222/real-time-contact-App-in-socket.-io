import React, { useState, useEffect } from "react";
import {BrowserRouter,Route} from "react-router-dom";
import AddContacts from "./components/AddContacts";

const App = () => {
  return (
    <>
    <BrowserRouter>
      <Route path="/" component={AddContacts} exact/>
    </BrowserRouter>
      
    </>
  );
};

export default App;
