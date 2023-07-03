/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
import React, { useState, useRef, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "./home.css";
import { useEffect } from "react";
import userUtils from "../../utils/user";
import loaderImg from "../../assets/chat/loader1.webp";
import casino from "../../assets/headerLogo.png";
import { pokerInstance } from "../../utils/axios.config";
import { toast } from "react-toastify";
import { useMemo } from "react";
import { FaCoins, FaTrophy, FaUser } from "react-icons/fa";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { socket } from "../../config/socketConnection";
import axios from "axios";
import UserContext from "../../context/UserContext";
import AlreadyInGamePopup from "../../components/pokertable/alreadyInGamePopup";
import Header from "./header";
import VerifyPasswordPopup from "../../components/pokertable/verifyPasswordPopu";
import Footer from "./footer";
import {
  useAddress,
  useSDK,
  ChainId,
  useMetamask,
  useActiveChain,
} from "@thirdweb-dev/react"; //, useTokenBalance, useTokenDrop, useTokenSupply
import { ethers } from "ethers";
import { convertUsdToEth, getTime } from "../../utils/utils";
import clock from "../../assets/clock-icon.svg";
import dice from "../../assets/dice.png";
import cards from "../../assets/cards.svg";
import hLeft from "../../assets/p-left-shape.svg";
import hRight from "../../assets/p-right-shape.svg";
// import { ethers } from "ethers";

let userId;
const Home = () => {
  // inital state

  const { userInAnyGame, setUserInAnyGame, user, setUser } =
    useContext(UserContext);
  const sdk = useSDK();
  const address = useAddress();
  const activeChain = useActiveChain();
  const connectWithMetamask = useMetamask();
  // const tokenDrop = useTokenDrop("0x4bcc5EacC1F1f0Ce61FC798c290AC53C468F76Bd");
  // const { data: tokenSupply } = useTokenSupply(tokenDrop);
  // const { data: tokenBalance } = useTokenBalance(tokenDrop);
  // console.log("activeChain ===>", activeChain);

  // useEffect(() => {
  //   if (activeChain?.chainId !== 42161) {

  //     connectWithMetamask({ chainId: ChainId.Arbitrum })
  //   }
  // }, [activeChain]);

  // const token

  useEffect(() => {
    if (user) {
      userId = user._id || user.id;
    }
  }, [user]);

  useEffect(() => {
    if (!address && !localStorage.getItem("token")) {
      connectWithMetamask({ chainId: ChainId.Arbitrum });
    }
  }, [address]);

  const gameInit = {
    gameName: "",
    public: false,
    minchips: "",
    maxchips: "",
    autohand: true,
    sitInAmount: "",
    invitedUsers: [],
    password: "",
  };
  // States//userInAnyGame,
  const [searchText, setSearchText] = useState("");
  const [loader, setLoader] = useState(true);
  const [userData, setUserData] = useState({});
  const [gameState, setGameState] = useState({ ...gameInit });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [pokerRooms, setPokerRooms] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [key, setKey] = useState("home");
  const history = useHistory();
  const [allUsers, setAllUsers] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  // utils function
  const checkUserInGame = async () => {
    try {
      let userData = await pokerInstance().get("checkUserInGame");
      if (userData?.data) {
        setUserInAnyGame(userData.data);
      }
    } catch (err) {
      console.log("error ==>", err);
      // toast.error("Internal server error", { toastId: "checkInGame" })
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      checkUserInGame();
    }
  }, []);
  const handleShow = () => {
    setShow(!show);
    setGameState({ ...gameInit });
    setShowSpinner(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("handle on change ==>", name, value);
    if (name === "public" || name === "autohand") {
      setGameState({ ...gameState, [name]: e.target.checked });
      return;
    } else if (name === "gameName") {
      if (value.length <= 20) {
        setGameState({ ...gameState, [name]: value });
        setErrors({
          ...errors,
          gameName: "",
        });
      } else {
        setErrors({
          ...errors,
          gameName: "Maximum 20 character is allowed for game name.",
        });
      }
    } else if (name === "minchips") {
      setGameState({ ...gameState, [name]: value, maxchips: (parseInt(value) * 2) });
    } else {
      setGameState({ ...gameState, [name]: value });
    }
  };

  // console.log("gameState ==>", gameState);

  const getUser = async () => {
    let user = await userUtils.getAuthUserData();
    userId = user?.data?.user?.id;
    if (userId) {
      localStorage.setItem("userId", userId);
    }
  };

  const handleChnageInviteUsers = (selectedOptions) => {
    setGameState({ ...gameState, invitedUsers: [...selectedOptions] });
  };

  const validateCreateTable = () => {
    let checkIfExist =
      pokerRooms?.length > 0 &&
      pokerRooms.find(
        (el) =>
          el.gameName.toLowerCase() === gameState.gameName.trim().toLowerCase()
      );

    let valid = true;
    let err = {};
    const mimimumBet = 0;
    if (gameState.gameName === "") {
      err.gameName = "Game name is required.";
      valid = false;
    }
    // if (gameState.password === "") {
    //   err.password = "Game name is required.";
    //   valid = false;
    // }
    if (gameState.gameName.trim() === "") {
      err.gameName = "Game name is required.";
      valid = false;
    }
    if (gameState.public) {
      if (gameState.password === "") {
        err.password = "Password is required.";
        valid = false;
      }
    }
    if (!userData?.wallet || gameState.minchips > userData?.wallet) {
      err.minchips = "You don't have enough balance in your wallet.";
      valid = false;
    } else if (gameState.minchips <= mimimumBet) {
      err.minchips =
        `Minimum bet can't be less then or equal to ` + mimimumBet + ".";
    } else if (gameState.minchips <= mimimumBet) {
      err.minchips =
        `Minimum bet can't be less then or equal to ` + mimimumBet + ".";
      valid = false;
    }
    // else if (
    //   parseInt(gameState?.sitInAmount) < parseInt(gameState?.minchips)
    // ) {
    //   err.minchips = "Small blind amount must be less than Sit In amount";
    //   valid = false;
    // }
    // if (!gameState.sitInAmount) {
    //   err.sitInAmount = `Sit in amount is required.`;
    //   valid = false;
    // }

    // if (parseFloat(gameState.sitInAmount) < 100) {
    //   err.sitInAmount = `Minimum sit in amount is 100.`;
    //   valid = false;
    // }

    console.log("userData ==>", userData);
    // if (parseFloat(gameState.sitInAmount) > userData?.wallet) {
    //   err.sitInAmount = `You don't have enough balance in your wallet.`;
    //   valid = false;
    // }

    //  else if (!gameState.maxchips) {
    //   err.maxchips = 'Please enter amount for big blind.';
    //   valid = false;
    // }
    // else
    if (parseFloat(gameState.maxchips) < parseFloat(gameState.minchips)) {
      err.maxchips = "Big blind amount cant be less then small blind";
      valid = false;
    } else if (gameState.minchips <= 0) {
      err.maxchips = "Minimum bet cant be less then or equal to 0";
      valid = false;
    }
    // else if (!gameState.public && !gameState.invitedUsers.length) {
    //   err.invitedPlayer = "Please invite some player if table is private.";
    //   valid = false;
    // }

    if (checkIfExist) {
      err.gameName = "Game name is already exist.";
      valid = false;
    }
    return { valid, err };
  };

  const createTable = async (e) => {
    console.log("create table executes");
    e.preventDefault();
    setErrors({});
    setShowSpinner(true);
    if (showSpinner) {
      return false;
    }

    const tableValidation = validateCreateTable();
    console.log("tableValidation ==>", tableValidation);
    if (!tableValidation.valid) {
      setErrors({ ...tableValidation.err });
      setShowSpinner(false);
      return;
    }
    try {
      const resp = await pokerInstance().post("/createTable", {
        ...gameState,
        // sitInAmount: parseInt(gameState.sitInAmount),
      });
      setGameState({
        gameName: "",
        public: false,
        minchips: "",
        maxchips: "",
        autohand: true,
        sitInAmount: "",
        invitedUsers: [],
        password: "",
      });
      history.push({
        pathname: "/table",
        search: "?gamecollection=poker&tableid=" + resp.data.roomData._id,
      });

      setShowSpinner(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message, {
          toastId: "create-table-error",
        });
      }
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await pokerInstance().get("/getAllUsers");
      setAllUsers(response.data.allUsers || []);
    })();
  }, []);

  useEffect(() => {
    // socket.on("updatePlayerList", (data) => {
    //   setTournaments(data);
    // });
    // socket.on("tournamentUpdate", (data) => {
    //   const { updateTournament } = data;
    //   if (updateTournament) {
    //     getTournamentDetails();
    //   }
    // });
    // socket.on("tournamentCreated", data => {
    //   setTournaments(data.tournaments)
    // })

    socket.on("NoTournamentFound", (data) => {
      toast.error("No tournament found", { toastId: "no-tournament" });
    });
    socket.on("AllTables", (data) => {
      setPokerRooms(data?.tables || []);
    });
    socket.on("updatedTournaments", (data) => {
      setTournaments(data?.tournaments || []);
    });
    socket.on("tournamentAction", (data) => {
      console.log("tournament action ==>", data);
      setTournaments(data?.tournaments || []);
    });
  }, []);

  const checkAuth = async () => {
    const data = await userUtils.getAuthUserData();
    // if (!data.success) {
    //   return (window.location.href = `${landingClient}`);
    // }
    setLoader(false);
    setUserData({ ...data?.data?.user });
  };
  // UseEffects
  useEffect(() => {
    checkAuth();
    getUser();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await pokerInstance().get("/rooms");
        setPokerRooms(response.data.rooms || []);
      } catch (error) { }
    })();
    (async () => {
      try {
        const response = await pokerInstance().get("/AllTournament");
        console.log("response ==>", response);
        setTournaments(response.data.tournament || []);
      } catch (error) { }
    })();
  }, []);

  const getTournamentDetails = async () => {
    try {
      const response = await pokerInstance().get("/AllTournament");
      const { status } = response;
      if (status === 200) {
        const { tournament } = response.data;
        setTournaments(tournament || []);
      }
    } catch (error) { }
  };

  useEffect(() => {
    getTournamentDetails();
  }, []);

  const options = useMemo(
    () =>
      allUsers.map((el) => {
        return { value: el.id, label: el.username };
      }),
    [allUsers]
  );
  console.log("poker rooms", pokerRooms);
  const filterRoom = pokerRooms?.filter((el) =>
    el.gameName?.toLowerCase().includes(searchText?.toLowerCase())
  );

  const handleSendTransaction = async (amount, type) => {
    console.log("transaction =>", address, amount, type);
    // Prepare a transaction, but DON'T send it
    // // const amt = await convertUsdToEth(amount);
    // console.log("ddddd", amount)
    try {
      // const estimatedGas = await pro[1].estimateGas(tx)
      // console.log('Estimated gas cost:', estimatedGas.toString());
      // tx.gasLimit = estimatedGas;
      // process.env.REACT_APP_OWNER_ADDRESS
      console.log(
        process.env.REACT_APP_OWNER_ADDRESS,
        process.env.REACT_APP_USDT_CONTRACT_ADDRESS,
        process.env.REACT_APP_USDC_CONTRACT_ADDRESS
      );
      if (type?.value === "USDT") {
        const hash = await sdk.wallet.transfer(
          process.env.REACT_APP_OWNER_ADDRESS,
          amount,
          process.env.REACT_APP_USDT_CONTRACT_ADDRESS
        );

        console.log("hash ===>", hash);
        return hash?.receipt?.transactionHash;
      } else if (type?.value === "USDC") {
        const hash = await sdk.wallet.transfer(
          process.env.REACT_APP_OWNER_ADDRESS,
          amount,
          process.env.REACT_APP_USDC_CONTRACT_ADDRESS
        );

        console.log("hash ===>", hash);
        return hash?.receipt?.transactionHash;
      } else if (type?.value === "ETH") {
        const amt = await convertUsdToEth(amount);
        const tx = {
          from: address,
          to: process.env.REACT_APP_OWNER_ADDRESS, //"0x2e09059610b00A04Ab89412Bd7d7ac73DfAa1Dcc",
          gasPrice: ethers.utils.parseUnits("1", "gwei"),
          gasLimit: 1000000,
          data: ethers.utils.toUtf8Bytes(
            JSON.stringify({ userId: user?.id || user?._id })
          ),
          value: ethers.utils.parseEther(amt.toFixed(9).toString()),
        };
        console.log("tx ===>", tx);
        const txResult = await sdk.wallet.sendRawTransaction(tx);
        console.log("tx = awd==>", txResult);
        console.log(txResult);
      }
    } catch (error) {
      // setShowEnterAmountPopup(false);
      console.log("error===", JSON.parse(JSON.stringify(error)));
      let newErr = JSON.parse(JSON.stringify(error));
      console.log(error);
      toast.error(
        error?.reason || newErr?.message || "Please connect your metamask",
        { toastId: "metamaskConnect" }
      );
      if (!error?.transactionHash) {
        // setTimeout(() => {
        //   window.location.href = "/";
        // }, 2000);
      }
      return error?.transactionHash;
    }
  };

  // const handleSendTransaction = async (amount) => {
  //   try {

  //   } catch (error) {
  //     // setShowEnterAmountPopup(false);
  //     console.log('error===', JSON.parse(JSON.stringify(error)));
  //     let newErr = JSON.parse(JSON.stringify(error))
  //     console.log(error);
  //     toast.error(newErr.reason || "Please connect your metamask", { toastId: "metamaskConnect" });
  //     if (!error?.transactionHash) {
  //       // setTimeout(() => {
  //       //   window.location.href = "/";
  //       // }, 2000);
  //     }
  //     return error?.transactionHash
  //   }
  // }

  const filterTournaments = tournaments.filter((el) =>
    el.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDeposit = async (amount, crrtype) => {
    try {
      if (activeChain?.chainId !== ChainId.Arbitrum) {
        await connectWithMetamask({ chainId: ChainId.Arbitrum });
      }

      const txhash = await handleSendTransaction(amount, crrtype);
      console.log("hash ==>", txhash, userId);
      if (txhash) {
        const resp = await pokerInstance().post("/depositTransaction", {
          txhash,
          amount,
          userId: user?.id || user?._id,
        });
        console.log("response after diposit trasnaction ==>", resp);
        if (resp?.data?.success) {
          toast.success(resp?.data?.message, { toastId: "trasnaction" });
          setUser(resp?.data?.user);
        } else {
          toast.error(resp?.data?.message, { toastId: "trasnaction" });
        }
        return resp?.data?.success;
      } else {
        return false;
      }
    } catch (err) {
      console.log("error in handleDeposit ==>", err);
      toast.error(err?.data?.message, { toastId: "trasnaction" });
      return false;
    }
  };

  const handleWithdraw = async (amount) => {
    try {
      let l = 1;
      console.log("================================", l);
      if (activeChain?.chainId !== ChainId.Arbitrum) {
        const vart = await connectWithMetamask({ chainId: ChainId.Arbitrum });
        l = 2;
        console.log("var =====>", vart);
      }
      console.log("================================", l);
      const resp = await pokerInstance().post("/withdrawTransaction", {
        userId: user._id || user.id,
        amount,
      });
      console.log("response ==>", resp);
      if (resp?.data.success) {
        toast.success(resp.data.message, { toastId: "withdrawTransaction" });
        setUser(resp.data.user);
        return true;
      } else {
        toast.error(resp.data.message, { toastId: "withdrawTransaction" });
        return false;
      }
    } catch (err) {
      console.log("error in withdrawTransaction", err.response);
      toast.error(err.response.data.message, {
        toastId: "withdrawTransaction",
      });
      return false;
    }
  };

  const [openCardHeight, setOpenCardHeight] = useState(150);
  const pokerCard = useRef(null);
  useEffect(() => {
    if (pokerCard?.current?.clientHeight) {
      setOpenCardHeight(pokerCard.current.clientHeight);
    }
  }, [pokerCard]);

  return (
    <div className="poker-home">
      {userInAnyGame?.inGame && (
        <AlreadyInGamePopup
          userInAnyGame={userInAnyGame}
          setUserInAnyGame={setUserInAnyGame}
        />
      )}
      {/* {console.log("loader ====>", loader)} */}
      {loader && (
        <div className="poker-loader">
          <img src={loaderImg} alt="loader" />
        </div>
      )}
      {/* {console.log('show---', show, handleChange)} */}
      {show && (
        <CreateTable
          handleChange={handleChange}
          show={show}
          handleShow={handleShow}
          values={gameState}
          createTable={createTable}
          errors={errors}
          options={options}
          handleChnageInviteUsers={handleChnageInviteUsers}
          showSpinner={showSpinner}
        />
      )}

      <Header
        userData={userData}
        handleShow={handleShow}
        handleDeposit={handleDeposit}
        handleWithdraw={handleWithdraw}
      />
      {/* <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="poker_tables" title="Poker Open Tables">
          <PokerTables >
        </Tab>
      </Tabs> */}
      <div className="home-poker-card">
        <div class="leftappImg">
          <img src={cards} alt="..." />
        </div>
        <div class="leftappdiceImg">
          <img src={dice} alt="..." />
        </div>
        <div class="leftappCircleImg">
          <img src={hLeft} alt="..." />
        </div>
        <div class="leftappRightImg">
          <img src={hRight} alt="..." />
        </div>
        <div className="container">
          <div className="poker-table-header">
            {/* <h2 className="lobbyHeader-title">Open Tables</h2> */}

            <div className="poker-tableSearch-box">
              <div className="poker-tableSearch">
                <input
                  id="mySearchInput"
                  className="form-control"
                  value={searchText}
                  // placeholder="Search tables . . . ."
                  onChange={(e) => setSearchText(e.target.value)}
                  autoComplete="off"
                />
                <Button className="red-btnPrimary">Search</Button>
              </div>
            </div>
          </div>

          <div className="poker-table-content">
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="pokarz-tabs"
            >
              <Tab eventKey="home" title="Open Tables">
                {filterRoom.length > 0 ? (
                  <>
                    <div className="home-poker-card-grid">
                      {filterRoom.map((el) => (
                        <React.Fragment key={el._id}>
                          <GameTable
                            data={el}
                            gameType="Poker"
                            height={openCardHeight}
                            setUserData={setUserData}
                            tableId={el._id}
                          />
                        </React.Fragment>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="d-flex flex-column justify-content-center align-items-center create-game-box">
                    <div className="no-room-available">
                      <h4>No Room Available</h4>

                      {/* <button type="button" onClick={handleShow}>
                        Create Game
                      </button> */}
                    </div>
                  </div>
                )}
              </Tab>
              <Tab eventKey="2" title="Poker Tournament Tables">
                {filterTournaments.length > 0 ? (
                  <div className="home-poker-card-grid">
                    {filterTournaments.map((el) => (
                      <React.Fragment key={el._id}>
                        <GameTournament
                          data={el}
                          gameType="Tournament"
                          getTournamentDetails={getTournamentDetails}
                          setUserData={setUserData}
                          filterTournaments={filterTournaments}
                        />
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <div className="d-flex flex-column justify-content-center align-items-center create-game-box">
                    <div className="no-room-available">
                      <h4>No Tournament Available</h4>
                    </div>
                  </div>
                )}
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
// const customStyles = {
//   option: (provided) => ({
//     ...provided,
//     background: "#000",
//     color: "#ddd",
//     fontWeight: "400",
//     fontSize: "16px",
//     padding: "10px 20px",
//     lineHeight: "16px",
//     cursor: "pointer",
//     borderRadius: "4px",
//     borderBottom: "1px solid #141414",
//     ":hover": {
//       background: "#141414",
//       borderRadius: "4px",
//     },
//   }),
//   menu: (provided) => ({
//     ...provided,
//     background: "#000",
//     borderRadius: "30px",
//     padding: "10px 20px",
//     border: "2px solid transparent",
//   }),
//   control: () => ({
//     background: "#000",
//     border: "2px solid #000",
//     borderRadius: "30px",
//     color: "#fff",
//     display: "flex",
//     alignItem: "center",
//     height: "41",
//     margin: "2px 0",
//     boxShadow: " 0 2px 10px #000000a5",
//     cursor: "pointer",
//     ":hover": {
//       background: "#000",
//       // border: "2px solid #306CFE",
//     },
//   }),
//   singleValue: (provided) => ({
//     ...provided,
//     color: "#fff",
//     fontWeight: "400",
//     fontSize: "14px",
//     lineHeight: "16px",
//   }),
//   indicatorSeparator: (provided) => ({
//     ...provided,
//     display: "none",
//   }),
//   placeholder: (provided) => ({
//     ...provided,
//     fontWeight: "400",
//     fontSize: "14px",
//     lineHeight: "19px",
//     color: "#858585c7",
//   }),
//   input: (provided) => ({
//     ...provided,
//     // height: "38px",
//     color: "fff",
//   }),
//   valueContainer: (provided) => ({
//     ...provided,
//     padding: "2px 20px",
//   }),
//   indicatorsContainer: (provided) => ({
//     ...provided,
//     paddingRight: "20px",
//     color: "#858585c7",
//   }),
//   svg: (provided) => ({
//     ...provided,
//     fill: "#858585c7 !important",
//     ":hover": {
//       fill: "#858585c7 !important",
//     },
//   }),
// };
const CreateTable = ({
  show,
  handleShow,
  handleChange,
  values,
  createTable,
  errors,
  // options,
  showSpinner,
  // handleChnageInviteUsers,
}) => {
  console.log("values ==>", values);

  return (
    <Modal show={show} onHide={handleShow} centered className="casino-popup">
      <Modal.Header closeButton>
        <Modal.Title className="text-dark">Create Table</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Password
        {values.public ? <input type="password"
          onFocus={(e) => {
            if (e.target.hasAttribute('readonly')) {
              e.target.removeAttribute('readonly');
              // fix for mobile safari to show virtual keyboard
              e.target.blur(); e.target.focus();
            }
          }}
          onChange={handleChange}
          readOnly={true}
          name="rer" autoComplete="off" defaultValue={values.password} placeholder="Enter your password" /> : ""
        } */}

        <Form.Group className="form-group" controlId="formPlaintextPassword">
          <Form.Label>Enter Game name</Form.Label>
          <Form.Control
            name="gameName"
            type="text"
            placeholder="Ex : John's game"
            onChange={handleChange}
            value={values.gameName}
          />
          {!!errors?.gameName && (
            <p className="text-danger">{errors?.gameName}</p>
          )}
        </Form.Group>
        <Form.Group
          className="form-group blindpopupField"
          controlId="formPlaintextPassword"
        >
          {/* <div>
            <Form.Label>Sit in amount</Form.Label>
            <Form.Control
              name="sitInAmount"
              onChange={handleChange}
              value={values.sitInAmount}
              type="number"
              placeholder="Ex : 100"
            />
            {!!errors?.sitInAmount && (
              <p className="text-danger">{errors?.sitInAmount}</p>
            )}
          </div> */}

          {/* <div> */}
          {" "}
          <div className="blindFields-box">

            {" "}
            <Form.Label>Small Blind / Big Blind</Form.Label>
            {/* <Form.Control
                  name="minchips"
                  onChange={handleChange}
                  value={values.minchips}
                  type="number"
                  placeholder="Ex : 50"
                /> */}
            <Form.Control
              as="select"
              name="minchips"
              value={values.minchips}
              onChange={handleChange}
            >
              <option value={0}>Please select SB / BB</option>
              <option value={2}>2 (SB) / 4 (BB) </option>
              <option value={4}>4 (SB) / 8 (BB) </option>
              <option value={10}>10 ( SB) / 20 (BB)</option>
              <option value={20}>20 (SB) / 40 (BB)</option>
              <option value={40}>40 (SB) / 80 (BB)</option>
              <option value={100}>100 (SB) / 200 (BB)</option>
            </Form.Control>

            {/* <div>
                {" "}
                <Form.Label>Big Blind</Form.Label>
                <Form.Control
                  name="maxchips"
                  onChange={handleChange}
                  value={values.minchips * 2}
                  type="number"
                  placeholder="Ex : 1000"
                  disabled
                />
              </div> */}
            {/* {!!errors?.maxchips && (
              <p className='text-danger'>{errors?.maxchips}</p>
            )} */}
          </div>
          {!!errors?.minchips && (
            <p className="text-danger">{errors?.minchips}</p>
          )}
          {/* </div> */}
        </Form.Group>
        {/* <div className="searchSelectDropdown">
          <Form.Label>Invite Users</Form.Label>
          <Select
            isMulti
            onChange={handleChnageInviteUsers}
            options={options}
            styles={customStyles}
          />
          {!!errors?.invitedPlayer && (
            <p className="text-danger">{errors?.invitedPlayer}</p>
          )}
        </div> */}
        {console.log("values in  component ==>", values)}
        {values.public && (
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="passoword"
              onFocus={(e) => {
                if (e.target.hasAttribute("readonly")) {
                  e.target.removeAttribute("readonly");
                  // fix for mobile safari to show virtual keyboard
                  e.target.blur();
                  e.target.focus();
                }
              }}
              onChange={handleChange}
              readOnly={true}
              name="password"
              autoComplete="off"
              defaultValue={values.password}
              placeholder="Enter your password"
            />
          </Form.Group>
        )}

        <div className="createGameCheckHand">
          <Form.Check
            inline
            label="Create Password"
            name="public"
            type="checkbox"
            id={"public"}
            onChange={handleChange}
            checked={values.public}
          />
          <Form.Check
            inline
            label="Auto Hand"
            name="autohand"
            type="checkbox"
            id={"autohand"}
            onChange={handleChange}
            checked={values.autohand}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleShow}>
          Close
        </Button>
        <Button variant="primary" type="submit" onClick={createTable}>
          {showSpinner ? <Spinner animation="border" /> : "Create Table"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const GameTable = ({
  data,
  gameType,
  getTournamentDetails,
  height,
  setUserData,
  tableId,
}) => {
  const { user } = useContext(UserContext);
  const [verifyPassword, setVerifyPassword] = useState(false);
  const history = useHistory();
  const redirectToTable = (table) => {
    if (table?.password) {
      setVerifyPassword(true);
      return;
    }
    socket.emit("checkAlreadyInGame", { userId, tableId });
    socket.on("userAlreadyInGame", (value) => {
      const { message, join } = value;
      if (join) {
        history.push({
          pathname: "/table",
          search: "?gamecollection=poker&tableid=" + data?._id,
        });
      } else {
        toast.error(message, { toastId: "create-table-error" });
      }
    });
  };

  useEffect(() => {
    // socket.on("alreadyInTournament", (data) => {
    //   const { message, code } = data;
    //   if (code === 200) {
    //     if (data?.user && Object.keys(data?.user)?.length > 0) {
    //       setUserData(data?.user);
    //     }
    //     console.log("helloo")
    //     toast.success(message, { toastId: "Nofull" });
    //   } else {
    //     toast.error(message, { toastId: "full" });
    //   }
    // });
    // socket.on("notEnoughAmount", (data) => {
    //   const { message, code } = data;
    //   if (code === 200) {
    //     toast.success(message, { toastId: "Nofull" });
    //   } else {
    //     toast.error(message, { toastId: "full" });
    //   }
    // });
    // socket.on("tournamentAlreadyFinished", (data) => {
    //   toast.error("Tournament has been finished.", { toastId: "tournament-finished" });
    // });
    // socket.on("tournamentAlreadyStarted", (data) => {
    //   toast.error(data.message, { toastId: "tournamentStarted" });
    // });
  }, []);

  // const enterRoom = async (tournamentId) => {
  //   const res = await tournamentInstance().post("/enterroom", {
  //     tournamentId: tournamentId,
  //   });
  //   if (res.data.code === 200) {
  //     let roomid = res.data.roomId;
  //     history.push({
  //       pathname: "/table",
  //       search: "?gamecollection=poker&tableid=" + roomid,
  //     });
  //   } else {
  // toast.error(toast.success(res.data.msg, { containerId: 'B' }))
  //   }
  // };

  const getTime = (time) => {
    // console.log("time: ", time);
    // var currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // var currentDate = new Date(time);

    // // Get the options for formatting the date
    // var options = {
    //   timeZone: `${ currentTimeZone }`, // Replace 'YourTimeZone' with the desired time zone, e.g., 'America/New_York'
    //   year: 'numeric',
    //   month: 'long',
    //   day: 'numeric',
    //   hour: 'numeric',
    //   minute: 'numeric',
    //   second: 'numeric'
    // };

    // // Convert the date to the desired time zone
    // var formattedDate = currentDate.toLocaleString(undefined, options);
    // console.log("formattedDate =====>", formattedDate, d, options, currentTimeZone, currentDate)
    let d = new Date(time);
    let pm = d.getHours() >= 12;
    let hour12 = d.getHours() % 12;
    if (!hour12) hour12 += 12;
    let minute = d.getMinutes();
    let date = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    return `${ date }/${ month }/${ year } ${ hour12 }:${ minute } ${ pm ? "pm" : "am" }`;
  };

  const [cardFlip, setCardFlip] = useState(false);
  // const [dateState, setDateState] = useState();
  // const handleFlip = (tDate) => {
  //   setCardFlip(!cardFlip);
  //   countDownData(tDate);
  // };
  // const countDownData = (tDate) => {
  //   var x = setInterval(() => {
  //     let countDownDate = new Date(tDate).getTime();
  //     var now = new Date().getTime();
  //     var distance = countDownDate - now;
  //     var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  //     var hours = Math.floor(
  //       (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  //     );
  //     var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //     var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  //     setDateState({
  //       days,
  //       hours,
  //       minutes,
  //       seconds,
  //     });
  //     if (distance < 0) {
  //       clearInterval(x);
  //       setDateState({
  //         days: "0",
  //         hours: "0",
  //         minutes: "0",
  //         seconds: "0",
  //       });
  //     }
  //   }, 1000);
  // };

  const wrapperRef = useRef();

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setCardFlip(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };
  useOutsideAlerter(wrapperRef);

  // const ifUserJoind = () => {
  //   let getData = data?.rooms?.find((el) =>
  //     el?.players?.find((el) => el?.userid === userId)
  //   );
  //   return getData;
  // };
  return (
    <>
      <div className="tournamentCard" ref={wrapperRef}>
        {/* {user ? <FaInfoCircle className="leaderboardBtn" onClick={() => handleFlip(data.tournamentDate)} /> : null} */}
        <div
          className={`tournamentCard-inner
         ${ cardFlip && gameType === "Poker" ? "rotate" : "" }
         `}
        >
          <VerifyPasswordPopup
            verifyPassword={verifyPassword}
            userId={userId}
            tableId={tableId}
            setVerifyPassword={setVerifyPassword}
          />
          {!cardFlip && gameType === "Poker" ? (
            <>
              <div className="pokerTournament-tableCard">
                <div className="pokerTournament-header">
                  <div className="pokerTournament-time">
                    <img src={clock} alt="icon" />
                    <h6>{getTime(new Date(data?.createdAt))}</h6>
                  </div>
                  <div className="tableCard-imgDetail">
                    <img src={casino} className="tournamentImg" alt="" />
                    <div className="tournamentCard-nameDetail">
                      <h2 title={data?.gameName}>
                        {gameType === "Poker" ? data?.gameName : data.name}
                      </h2>
                      <p>
                        People Joined :{" "}
                        <span>
                          {" "}
                          {(gameType === "Tournament"
                            ? data?.rooms?.filter((el) => el?.players)[0]
                              ?.players?.length || 0
                            : data?.players?.length) || 0}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="tournamentCard-extraDetail">
                  <div className="cardTournament-Fee">
                    <p>SB/BB</p>
                    <div className="extraDetail-container">
                      <FaCoins />
                      {data?.smallBlind}
                      {"/"}
                      {data?.bigBlind}
                    </div>
                  </div>
                  <div className="cardTournament-Fee">
                    <p>Table Type</p>
                    <div className="extraDetail-container">
                      <FaUser />
                      {data.password ? "Private" : "Public"}
                    </div>
                  </div>
                </div>
                {gameType === "Poker" && user ? (
                  <div className="tournamentCard-buttonDetail">
                    <Button
                      onClick={() => redirectToTable(data)}
                      type="submit"
                      disabled={user ? false : true}
                      className="red-btnPrimary"
                    >
                      join game
                    </Button>
                  </div>
                ) : (
                  ""
                )}
              </div>

              {/* <div className="tournamentCard-front">
                <img className="cardlogo" src={casino} alt="" style={{ widows: "170px", height: '95px' }} />
                <div className="tournamentFront-info">
                  <h4 className="tableName">{gameType === "Poker" ? data?.gameName : data.name}</h4>

                  <h4>Created At: <span>{getTime(data?.createdAt)}</span></h4>
                  <h4>
                    people joined :{" "}
                    <span>
                      {(gameType === "Tournament"
                        ? data?.rooms?.filter((el) => el?.players)[0]?.players
                          ?.length || 0
                        : data?.players?.length) || 0}
                    </span>
                  </h4>
                  <h4>SB/BB : <span>{data?.smallBlind}{"/"}{data?.bigBlind}</span></h4>
                  <h4>Table Type: <span>{data.password ? "Private" : "Public"}</span></h4>
                  {gameType === "Poker" && user ? (
                    <button onClick={() => redirectToTable(data)} type="submit" disabled={user ? false : true}>
                      Join Game
                    </button>
                  ) : user ? (
                    <div className="btn-grid">
                      {" "}
                      {!data?.isFinished ? (
                        <button
                          disabled={ifUserJoind()}
                          onClick={() =>
                            joinTournament(data?._id, data?.tournamentFee)
                          }
                          type="submit"
                        >
                          Join Game
                        </button>
                      ) : null}
                      {ifUserJoind() && !data?.isFinished ? (
                        <button
                          onClick={() => enterRoom(data?._id)}
                          type="submit"
                        >
                          Enter Game
                        </button>
                      ) : null}
                      {data?.isFinished && (
                        <div className="tournamentRanking">
                          <h6>Tournament Finished</h6>
                          <Button>Check Ranking</Button>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div> */}
            </>
          ) : (
            <div className="tournamentCard-back" style={{ height: height }}>
              {gameType === "Poker" ? (
                <AvatarGroup imgArr={data?.players} />
              ) : (
                ""
              )}
              <h4>
                Created At: <span>{getTime(data?.createdAt)}</span>
              </h4>
              <h4>
                people joined : {console.log("data", data)}
                <span>
                  {(gameType === "Tournament"
                    ? data?.rooms?.filter((el) => el?.players)[0]?.players
                      ?.length || 0
                    : data?.players?.length) || 0}
                </span>
              </h4>
              <h4>
                SB/BB :{" "}
                <span>
                  {data?.smallBlind}
                  {"/"}
                  {data?.bigBlind}
                </span>
              </h4>
              <h4>
                Table Type: <span>{data.password ? "Private" : "Public"}</span>
              </h4>
              {gameType === "Tournament" ? (
                <h4>
                  Fee : <span>{data?.tournamentFee}</span>
                </h4>
              ) : (
                ""
              )}
              {gameType === "Tournament" ? (
                <h4>
                  Date : <span>{getTime(data?.tournamentDate)}</span>
                </h4>
              ) : (
                ""
              )}
              {gameType === "Tournament" ? (
                <>
                  {/* <div id="clockdiv">
                    <h4>
                      Days
                      <span class="days">{dateState?.days || "0"}</span>
                    </h4>
                    <h4>
                      Hours
                      <span class="hours">{dateState?.hours || "0"}</span>
                    </h4>
                  </div>
                  <div id="clockdiv">
                    <h4>
                      Minutes
                      <span class="minutes">{dateState?.minutes || "0"}</span>
                    </h4>
                    <h4>
                      Seconds
                      <span class="seconds">{dateState?.seconds || "0"}</span>
                    </h4>
                  </div> */}
                </>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const GameTournament = ({
  data,
  gameType,
  getTournamentDetails,
  height,
  setUserData,
  tableId,
}) => {
  // const history = useHistory();
  const { user } = useContext(UserContext);

  useEffect(() => {
    let count = 0;
    socket.on("alreadyInTournament", (data) => {
      console.log("Count ==>", count++)
      const { message, code } = data;
      if (code === 200) {
        if (data?.user && Object.keys(data?.user)?.length > 0) {
          setUserData(data?.user);
          console.log("messagemessagemessagemessage ==>", message);
          toast.success(message, { toastId: "Nofull" });
        }
      } else {
        toast.error(message, { toastId: "full" });
      }
      // return () => {
      //   socket.off("alreadyInTournament");
      // };
    });

    socket.on("notEnoughAmount", (data) => {
      const { message, code } = data;
      if (code === 200) {
        toast.success(message, { toastId: "Nofull" });
      } else {
        toast.error(message, { toastId: "full" });
      }
    });

    socket.on("tournamentSlotFull", (data) => {
      toast.error("Tournament slot is full", { id: "slot-full" });
    });



  }, []);

  const joinTournament = async (tournamentId, fees) => {
    console.log("tournament data ==>", tournamentId, fees);

    socket.emit("joinTournament", {
      tournamentId: tournamentId,
      userId: userId,
      fees,
    });
    setTimeout(() => {
      getTournamentDetails();
    }, 1000);
  };

  const handleEnterGame = (roomId) => {
    console.log("enter game ", window.location.origin, roomId);
    if (roomId) {
      window.location.href =
        window.location.origin + "/table?gamecollection=poker&tableid=" + roomId;
    } else {
      toast.error("Tournament is not started yet", { toastId: "tournamentStarted" })
    }
  };

  // const enterRoom = async (tournamentId) => {
  //   const res = await tournamentInstance().post("/enterroom", {
  //     tournamentId: tournamentId,
  //   });
  //   if (res.data.code === 200) {
  //     let roomid = res.data.roomId;
  //     history.push({
  //       pathname: "/table",
  //       search: "?gamecollection=poker&tableid=" + roomid,
  //     });
  //   } else {
  //     // toast.error(toast.success(res.data.msg, {containerId: 'B' }))
  //   }
  // };
  // const handleFlip = (tournamentId) => {
  //   history.push(`/leaderboard?tournamentId=${ tournamentId }`)
  // };
  // const ifUserJoind = () => {
  //   let getData = data?.rooms?.find((el) =>
  //     el?.players?.find((el) => el?.userid === userId)
  //   );

  //   return getData;
  // };
  // var startDateTime = new Date(data?.tournamentDate).toLocaleString(undefined, {timeZone: 'Asia/Kolkata' });

  return (
    <>
      <div className="pokerTournament-tableCard">
        <div className="pokerTournament-header">
          <div className="pokerTournament-time">
            <img src={clock} alt="icon" />
            <h6>{getTime(new Date(data?.createdAt))}</h6>
          </div>
          <div className="tableCard-imgDetail">
            <img src={casino} className="tournamentImg" alt="" />
            <div className="tournamentCard-nameDetail">
              <h2>{data?.name}</h2>
              {data?.isStart ? (
                <p className="tournamentRunning">Tournament Running ...</p>
              ) : data?.isFinished ? (
                <p className="tournamentFinished">Tournament Finished ...</p>
              ) : (
                <p>Not started ...</p>
              )}
            </div>
          </div>
        </div>
        <div className="tournamentCard-extraDetail">
          <div className="cardTournament-Fee">
            <p>Entry Fee</p>
            <div className="extraDetail-container">
              <FaCoins />
              {data?.tournamentFee}
            </div>
          </div>
          <div className="cardTournament-Fee">
            <p>Participants</p>
            <div className="extraDetail-container">
              <FaUser />
              {data?.havePlayers}
            </div>
          </div>

        </div>
        <div className="cardTournament-Fee bottom-fee-detail winning-amt">
          <p>Winning amount</p>
          <div className="extraDetail-container">
            <FaTrophy />
            {data?.winnerAmount}
          </div>
        </div>
        <div className="tournamentCard-buttonDetail">
          {/* {ifUserJoind() ? <Button type="text" onClick={() => enterRoom(data?._id)}>Enter game</Button> : <Button type="text" onClick={() =>
            joinTournament(data?._id, data?.tournamentFee)
          }>join game</Button>} */}
          {/* {console.log("crr player", data?.waitingArray.find(el => el.id === user?.id), user?.id)} */}
          {console.log("usressssss ===>", data)}
          {data.isFinished || data?.eleminatedPlayers.includes(userId?.toString()) ? data.isFinished ? (<div className="cardTournament-Fee bottom-fee-detail">
            <p>{data?.winPlayer[0]?.username}</p>
            <div className="extraDetail-container">
              <FaTrophy />
              Winner
            </div>
          </div>) : null : user &&
            !data?.waitingArray.find(
              (el) => el.id === (user?.id || user?._id)
            ) ? (
            <Button
              type="text"
              onClick={() => {
                joinTournament(data?._id, data?.tournamentFee);
              }}
              className="red-btnPrimary"
            >
              Join game
            </Button>
          ) : user ? (
            <Button
              type="text"
              onClick={() => {
                handleEnterGame(
                  data?.waitingArray.find(
                    (el) => el.id === (user?.id || user?._id)
                  ).roomId
                );
              }}
              className="red-btnPrimary"
            >
              Enter game
            </Button>
          ) : null}

          {/* <img src={ranking} alt="" onClick={() => { handleFlip(data._id) }} /> */}
        </div>
      </div>
    </>
  );
};

const AvatarGroup = ({ imgArr }) => {
  return (
    <div className="poker-avatar-box">
      <div className="avatars">
        {Array.isArray(imgArr) &&
          imgArr.map((el) => (
            <span className="avatar">
              <img
                src={
                  el.photoURI ||
                  "https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg"
                }
                width="30"
                height="30"
                alt=""
              />
            </span>
          ))}
      </div>
      {/* <p>{imgArr?.length || 0} people</p> */}
    </div>
  );
};

// const TournamentGroup = ({players}) => {
//   return (
//     <div className="poker-avatar-box">
//       <p>{players || 0} people joined</p>
//     </div>
//   );
// };

export default Home;
