import React from 'react';
import "./Assets/css/apps.css"
import "./Assets/css/bootstrap.css"
import "./Assets/css/font-awesome.css"
// import "./Assets/js/bootstrap.min.js"

import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Screens/Homescreen/Home';
import About from './Screens/About/About';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import ActRules from './Screens/ActRules/ActRules';
import ImportantAnnouncement from './Screens/Important Announcement/ImportantAnnouncement';
import NotificationsOrders from './Screens/Notifications Orders/NotificationsOrders';
import TendersPage from './Screens/TendersPage/TendersPage';
import DownloadPage from './Screens/DownloadPage/DownloadPage';
import GalleryPage from './Screens/GalleryPage/GalleryPage';
import ContactUs from './Screens/ContactUs/ContactUs';
import TestPage from './Screens/TestPage/TestPage';
import MapboxExample from './Screens/MapExample/MapboxExample';
import SearchPage from './Screens/SearchPage/SearchPage';
import SearchPageDetails from './Screens/SearchPageDetails/SearchPageDetails';
import Faq from './Screens/Faq/Faq';



const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
      {
        path:"",
        element:<Home/>
      },
      {
        path:"about",
        element:<About/>
      },
      {
        path:"actRules",
        element:<ActRules/>
      },
      {
        path:"importantannouncement",
        element:<ImportantAnnouncement/>
      },
      {
        path:"notificationsorders",
        element:<NotificationsOrders/>
      },
      {
        path:"tenders",
        element:<TendersPage/>
      },
      {
        path:"downloads",
        element:<DownloadPage/>
      },
      {
        path:"gallery",
        element:<GalleryPage/>
      },
      {
        path:"contact-us",
        element:<ContactUs/>
      },
      {
        path:"search",
        element:<SearchPage/>
      },
      {
        path:"test",
        element:<TestPage/>
      },
      {
        path:"map",
        element:<MapboxExample/>
      },
      {
        path:"searchdetails",
        element:<SearchPageDetails/>
      },
      {
        path:"faq",
        element:<Faq/>
      }

    ]
  },
  // {
  //   path: "bill/:id",
  //   element: <Bill />,
  // },
  // {
  //   path: "noresult/:code/:msg",
  //   element: <Noresult />,
  // },
  // {
  //   path: "*",
  //   element: <Notfound />,
  // },
]);

root.render(
  <React.StrictMode>
    {/* <PrimeReactProvider> */}
      <RouterProvider router={router} />
      {/* </PrimeReactProvider> */}
    {/* <App /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
