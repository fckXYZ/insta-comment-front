import {Route, Routes} from 'react-router';
import {BrowserRouter} from "react-router-dom";

import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from "./containers/profile";
import Posting from "./containers/posting";
import Header from "./components/Header";
import {useEffect} from "react";
import Loader from "./components/Loader";


function App() {

    useEffect(() => {
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');
        if (username && password) {

        }
    })
  return (
    <div className="App">
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Loader />} />
            <Route path='/posting/:postId' element={<Posting />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    </div>
  );
}

export default App;
