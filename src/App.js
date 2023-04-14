import React, { useEffect, useState } from "react";
import {
  // HashRouter,
  BrowserRouter as Router,
  // Switch,
  Route,
  Switch,
} from "react-router-dom";
import PokerTable from "./components/pokertable/table";
import "animate.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Home from "./page/home/Home";
import UserContext from "./context/UserContext";
import LeaderBoard from "./page/home/leaderBoard";
import Error404 from "./page/Error404/Error404";
import CreateAccount from "./components/register/CreateAccount";
import Login from "./components/login/Login";
import userUtils from "./utils/user";

const App = () => {
  const [userInAnyGame, setUserInAnyGame] = useState();
  const [user, setUser] = useState();
  const getUser = async () => {
    let res = await userUtils.getAuthUserData();
    setUser(res?.data?.user);
  };
  useEffect(() => {
    if (window.width < window.height) {
      let w = window.width;
      window.width = window.height;
      window.height = w;
    }
    getUser();
  }, []);

  console.log("user ==>", user);
  return (
    <div className='App'>
      <UserContext.Provider
        value={{
          userInAnyGame,
          setUserInAnyGame,
          user,
          setUser,
        }}>
        <Router>
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route exact path='/register'>
              <CreateAccount />
            </Route>
            <Route exact path='/login'>
              <Login />
            </Route>
            <Route exact path='/leaderboard'>
              <LeaderBoard />
            </Route>
            <Route exact path='/table'>
              <PokerTable />
            </Route>
            <Route path='*'>
              <Error404 />
            </Route>
          </Switch>
        </Router>
        <ToastContainer />
      </UserContext.Provider>
      {/* <div className='abc'>
        <Toaster
          position='top-right'
          reverseOrder={false}
          toastOptions={{
            className: 'custom-toast',
          }}
        />
      </div> */}
    </div>
  );
};

export default App;
