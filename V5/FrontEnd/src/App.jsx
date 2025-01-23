import './App.css'

import Nav from './NavBar/Nav.jsx'
import Notification from './Chats/Notifications.jsx'
import Landing from './landingPage/landingPage.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Authentication/Login/login.jsx'
import Register from './Authentication/Register/register.jsx'
import { AuthProvider } from './Context/AuthContext.jsx'
import PrivateRoute from './Private/privateRoute.jsx'
import Profile from './Authentication/Profile/Profile.jsx'
import ErrorRoute from './Private/Error.jsx'

import HomePage from './HomePage/HomePage.jsx'

import SearchPage from './Search/SearchPage.jsx'
import Post from './Card/PostCard.jsx'
import Settings from './Authentication/Settings/Settings.jsx'
// UI Error Handler
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from './Authentication/Profile/UserProfile.jsx'
import Feed from './Feed/Feed.jsx'



function App() {
  return (
    <>


      <Router>
        <AuthProvider>
          <Nav />
          <Notification />
          <Routes>
            <Route element={<ErrorRoute><Login /></ErrorRoute>} path='/login' />
            <Route path='/' index element={<Landing />} />
            <Route element={<PrivateRoute><Profile /></PrivateRoute>} path="/profile" />
            <Route element={<ErrorRoute><Register /></ErrorRoute>} path='/register' />

            <Route element={<PrivateRoute><Settings /></PrivateRoute>} path='/settings'></Route>
            <Route element={<PrivateRoute><Feed /></PrivateRoute>} path='/feed'></Route>
            {/* <Route element={<PrivateRoute><ProfilePage /></PrivateRoute>} path='/profilesss' /> */}
            <Route element={<PrivateRoute><HomePage /></PrivateRoute>} path='/homepage' />
            <Route element={<SearchPage />} path='/search' />
            <Route element={<UserProfile />} path='/:username' />
            <Route element={<PrivateRoute><Post /></PrivateRoute>} path='/PostCard' />

          </Routes>
        </AuthProvider >
      </Router >
      <ToastContainer />
    </>

  )
}

export default App
