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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./page/home/Home";
import UserContext from "./context/UserContext";
import LeaderBoard from "./page/home/leaderBoard";
import Error404 from "./page/Error404/Error404";
import CreateAccount from "./components/register/CreateAccount";
import userUtils from "./utils/user";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
//ChainId,
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

  // console.log("user ==>", user);
  return (
    <div className='App'>
      <UserContext.Provider
        value={{
          userInAnyGame,
          setUserInAnyGame,
          user,
          setUser,
        }}>
        <ThirdwebProvider
          activeChain={ChainId.Arbitrum}
          dAppMeta={{
            name: "ACE Poker",
            description:
              "Everything you need to be a high roller in the Scrooge Casino.",
            isDarkMode: true,
            logoUrl:
              "https://casino-nft-marketplace.s3.amazonaws.com/highRollerBasic.png",
            url: "https://market.scrooge.casino",
          }}>
          <Router>
            <Switch>
              <Route exact path='/'>
                <Home />
              </Route>
              <Route exact path='/register'>
                <CreateAccount />
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
          {/* <ToastContainer /> */}
        </ThirdwebProvider>
      </UserContext.Provider>
      <div className='abc'>
        <ToastContainer
          position='top-right'
          reverseOrder={false}
          toastOptions={{
            className: "custom-toast",
          }}
          autoClose={5000}
        />
      </div>
    </div>
  );
};

export default App;
