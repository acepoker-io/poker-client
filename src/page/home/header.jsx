/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import numFormatter from "../../utils/utils";
import token from "../../assets/coin.png";
import deposit from "../../assets/deposit.png";
import withdraw from "../../assets/withdraw.png";

import {
  Button,
  ButtonGroup,
  Dropdown,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";
// import { Tooltip } from "react-bootstrap";
import logo from "../../assets/newlogo.png";
// import { FaQuestionCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { authInstance, userInstance } from "../../utils/axios.config";
import Register from "./registerPage";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import {
  useAddress,
  useMetamask,
  useDisconnect,
  ChainId,
} from "@thirdweb-dev/react"; //ChainId,
import { clientUrl } from "../../config/keys";
import Select from "react-select";
import { FaBell } from "react-icons/fa";
import Notifications from "./Notifications";

const Header = ({ userData, handleShow, handleDeposit, handleWithdrawRequest }) => {
  const { user, setUser } = useContext(UserContext);
  const disconnect = useDisconnect();
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  // const renderWallet = (props) => (
  //     <Tooltip id="button-tooltip" {...props}>
  //         This is your token balance, and can be used for betting.
  //     </Tooltip>
  // );
  // const renderTicket = (props) => (
  //     <Tooltip id="button-tooltip" {...props}>
  //         This is your ticket balance and can be redeemed for prizes.
  //     </Tooltip>
  // );
  const [account, setAccount] = useState(null);
  const [openRegister, setOpenRegister] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showWithdrawTransaction, setShowWithdrawTransaction] = useState(false);
  const [depositAmt, setDepositAmt] = useState("");
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastAddres, setLastAddres] = useState("");
  const [currencyType, setCurrencType] = useState({
    value: "USDT",
    label: "USDT",
  });
  const [notificationCount, setNotificationCount] = useState(0);

  const [show, setShow] = useState(false);
  const handleclickShow = () => setShow(!show);

  // console.log("currencyType ==>", currencyType);

  const handleLogOut = () => {
    console.log("logout executed");
    disconnect();
    localStorage.clear();
    // history.push("/");
    window.location.href = "/";
  };

  useEffect(() => {
    let loginCall;
    const connectHandler = async () => {
      try {
        console.log("address ==>", address);
        if (address) {
          // console.log("last adreess ==>", lastAddres);
          // console.log("adreess ==>", address);

          // setTimeout(async () => {

          if (lastAddres && lastAddres !== address) {
            console.log("hello");
            disconnect();
            localStorage.clear();
            // history.push("/");
            window.location.href = "/";
            setLastAddres();
            setUser(null);
            return;
          }
          setLastAddres(address);
          setAccount(address);
          const resp = await authInstance().post("/loginWithMetamask", {
            metaMaskAddress: address,
          });
          console.log("Response--->", resp);
          const { status, message, token, user } = resp?.data;
          if (status === 200) {
            setUser(user);
            localStorage.setItem("token", token);
          }
          if (status === 401) {
            toast.error(message, { toastId: "toastId" });
            setOpenRegister(true);
          }
          // await getAllRequiredData()
          // }, 1000);
        }
      } catch (err) {
        console.error(err);
        toast.error("There was a problem connecting to MetaMask", {
          toastId: "A",
        });
      }
    };
    /* disable eslint react-hooks/exhaustive-deps */
    if (!loginCall) {
      loginCall = setTimeout(async () => {
        await connectHandler();
      }, 1000);
    } else {
      clearTimeout(loginCall);
    }
  }, [address, setUser, lastAddres, disconnect]);

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const resp = await userInstance().get("/notificationCount");
          // console.log("resp ==>", resp);
          setNotificationCount(resp.data.counts);
        } catch (err) {
          console.log("err");
        }
      })();
    }
  }, [user]);

  const handleDepositAmt = (e) => {
    let amt = e.target.value;
    console.log("amt ==>", amt);
    if (amt.toString().includes("-")) {
      amt = amt.replace("-", "");
    }
    setDepositAmt(amt);
  };

  const handleShowDepositPopUp = () => {
    setShowTransactionModal(true);
    setDepositAmt("");
  };

  const handleDepositTransaction = async () => {
    setShowSpinner(true);
    try {
      await handleDeposit(depositAmt, currencyType);
      // if(resp)
      setShowSpinner(false);
      setShowTransactionModal(false);
      setDepositAmt("");
    } catch (e) {
      setShowSpinner(false);
      setShowTransactionModal(false);
      console.log("erroor in  handle transaction deposit", e);
    }
  };

  const handleWithdrawAmt = (e) => {
    let val = e.target.value;
    console.log("amt ==>", val, e.target);
    // if (val.toString().includes("-") || val.toString().includes("e")) {
    val = val.replace(/\D+/g, "");
    // }
    //  += key;
    console.log("handle wthdraw executed", val);
    setWithdrawAmt(val);
  };

  const handleWithdrawTransaction = async () => {
    try {
      setShowSpinner(true);
      if (withdrawAmt) {
        const resp = await handleWithdrawRequest(withdrawAmt);
        if (resp) {
          setShowWithdrawTransaction(false);
        }
        setShowSpinner(false);
      } else {
        toast.error("Please enter amount", { id: "withdrawAmt" });
        setShowSpinner(false);
      }
    } catch (err) {
      console.log("error in handleWithdrawTransaction", err);
      setShowSpinner(false);
    }
  };

  const handleShowWithdrawPopUp = (e) => {
    setShowWithdrawTransaction(true);
    setWithdrawAmt("");
  };

  //   const chainChanged = () => {
  //     setAccount(null);
  //     setBalance(null);
  //   };

  // console.log("User in address ===>", user)
  const handleNotifiationShow = async () => {
    setShowNotifications(!showNotifications);
    setNotificationCount(0);
    if (!showNotifications && notificationCount) {
      await userInstance().get("/seenAllNotifications");
      // const resp =
      // console.log("response ==>", resp);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  });

  const isSticky = (e) => {
    const header = document.querySelector(".user-header");
    const scrollTop = window.scrollY;
    scrollTop >= 50
      ? header.classList.add("is-sticky")
      : header.classList.remove("is-sticky");
  };

  return (
    <>
      <div className="user-header">
        <div className="user-header-grid">
          <div className="casino-logo">
            <a href={clientUrl}>
              <img src={logo} alt="" />
            </a>
          </div>

          <div className="user-header-left">
            {!user && (
              <div className="header-navlink-desktop-content">
                <div class="navLink">
                  <ul>
                    <li>
                      <a href="https://acepoker.io/">Homepage</a>
                    </li>
                    <li>
                      <a href="https://acepoker.io/#about-us">About us</a>
                    </li>
                    <li>
                      <a href="https://acepoker.io/#playPoker">Play Poker</a>
                    </li>
                    <li>
                      <a href="https://acepoker.io/#WPT_Token">ACE Token</a>
                    </li>
                    <li>
                      <a href="https://docs.acepoker.io">Docs</a>
                    </li>
                    <li class="ddparent">
                      <a href="/">Security &amp; Privacy</a>
                      <span class="menuDdIcon">
                        <img
                          src="https://acepoker.io/wp-content/themes/harsol/assets/images/PrivacyIcon.svg"
                          alt="..."
                        />
                      </span>
                      <ul class="ddstyle">
                        <li>
                          <a href="https://acepoker.io/privacy/">
                            Privacy Policy
                          </a>
                        </li>
                        <li>
                          <a href="https://acepoker.io/cookie-policy-2/">
                            Cookie Policy
                          </a>
                        </li>
                        <li>
                          <a href="https://acepoker.io/tearm-of-use/">
                            Tearm of use
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="https://acepoker.io/service/">Services</a>
                    </li>
                    <li>
                      <a href="https://acepoker.io/#footer">Contact</a>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div className="create-game-box">
              {user ? (
                <>
                  {/* <a href={`${landingClient}profile`}> */}
                  <div className="create-game-box-login">
                    <div className="create-game-box-avtar">
                      {/* <img
                                    src={
                                        user?.profile ||
                                        "https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg"
                                    }
                                    alt=""
                                /> */}
                      <h6>User Name</h6>
                      <h5>{user?.username}</h5>
                    </div>
                    <div
                      className="create-game-box-avtar"
                      onClick={handleNotifiationShow}
                    >
                      <FaBell />
                      {notificationCount ? (
                        <span>{notificationCount}</span>
                      ) : null}
                      {showNotifications ? <Notifications /> : null}
                    </div>
                    {/* </a> */}
                    <div className="walletTicket-box">
                      <Dropdown as={ButtonGroup}>
                        <Button>
                          <div className="pokerWallet-box">
                            <img src={token} alt="" className="pokerWallet" />
                            <span>
                              {numFormatter(user?.wallet.toFixed(2) || 0)}
                            </span>
                            {/* <OverlayTrigger
                                            placement={window.innerWidth < 767 ? "right" : "left"}
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={renderWallet}
                                        >
                                            <Button variant="success">
                                                <FaQuestionCircle />
                                            </Button>
                                        </OverlayTrigger> */}
                          </div>
                        </Button>
                        <Dropdown.Toggle split id="dropdown-split-basic" />
                        <Dropdown.Menu flip="True" align="start">
                          <Dropdown.Item onClick={handleShowDepositPopUp}>
                            Deposit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={handleShowWithdrawPopUp}>
                            Withdraw
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>

                      {/* <div className="pokerWallet-box">
                                        <img src={tickets} alt="" className="pokerWallet" />
                                        <span>{numFormatter(user?.ticket || 0)}</span>
                                        <OverlayTrigger
                                            placement={window.innerWidth < 767 ? "right" : "left"}
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={renderTicket}
                                        >
                                            <Button variant="success">
                                                <FaQuestionCircle />
                                            </Button>
                                        </OverlayTrigger>
                                    </div> */}
                    </div>

                    <button
                      type="button"
                      className="create-game-boxBtn"
                      onClick={handleShow}
                    >
                      Create Game
                    </button>
                    <button
                      type="button"
                      className="create-game-boxBtn"
                      onClick={handleLogOut}
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="connect-meta red-btnPrimary"
                    onClick={() =>
                      connectWithMetamask({ chainId: ChainId.Arbitrum })
                    }
                  >
                    Connect
                  </button>
                  <div className="menubtn" onClick={handleclickShow}>
                    <div class="switch">
                      <input type="checkbox" />
                      <div>
                        <span class="line-1"></span>
                        <span class="line-2"></span>
                        <span class="line-3"></span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="menubtn-mobile" onClick={handleclickShow}>
                <div class="switch">
                  <input type="checkbox" />
                  <div>
                    <span class="line-1"></span>
                    <span class="line-2"></span>
                    <span class="line-3"></span>
                  </div>
                </div>
              </div>
              {/* {ChainId.ArbitrumGoerli} */}
            </div>
          </div>

          <div className={`navCol-responsive ${ show ? `active` : `` }`}>
            {/* <div class='navCol-responsive'> */}
            {user ? (
              <>
                <div className="create-game-box-sidebar">
                  <div className="create-game-box">
                    <div className="create-game-box-avtar">
                      <h6>User Name</h6>
                      <h5>{user?.username}</h5>
                    </div>
                    <div
                      className="create-game-box-avtar"
                      onClick={handleNotifiationShow}
                    >
                      <FaBell />
                      {notificationCount ? (
                        <span>{notificationCount}</span>
                      ) : null}
                      {showNotifications ? <Notifications /> : null}
                    </div>

                    <div className="walletTicket-box">
                      <Dropdown as={ButtonGroup}>
                        <Button>
                          <div className="pokerWallet-box">
                            <img src={token} alt="" className="pokerWallet" />
                            <span>
                              {numFormatter(user?.wallet.toFixed(2) || 0)}
                            </span>
                          </div>
                        </Button>
                        <Dropdown.Toggle split id="dropdown-split-basic" />
                        <Dropdown.Menu flip="True" align="start">
                          <Dropdown.Item onClick={handleShowDepositPopUp}>
                            Deposit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={handleShowWithdrawPopUp}>
                            Withdraw
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>

                    <button
                      type="button"
                      className="create-game-boxBtn"
                      onClick={handleShow}
                    >
                      Create Game
                    </button>
                    <button
                      type="button"
                      className="create-game-boxBtn"
                      onClick={handleLogOut}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div class="row align-items-center">
                <div class="col-lg">
                  <div class="navLink-content">
                    <ul>
                      <li>
                        <a href="https://acepoker.io/">Homepage</a>
                      </li>
                      <li>
                        <a href="https://acepoker.io/#about-us">About us</a>
                      </li>
                      <li>
                        <a href="https://acepoker.io/#playPoker">Play Poker</a>
                      </li>
                      <li>
                        <a href="https://acepoker.io/#WPT_Token">ACE Token</a>
                      </li>
                      <li>
                        <a href="https://docs.acepoker.io">Docs</a>
                      </li>
                      <li class="ddparent">
                        <a href="/">Security &amp; Privacy</a>
                        <span class="menuDdIcon">
                          <img
                            src="https://acepoker.io/wp-content/themes/harsol/assets/images/PrivacyIcon.svg"
                            alt="..."
                          />
                        </span>
                        <ul class="ddstyle">
                          <li>
                            <a href="https://acepoker.io/privacy/">
                              Privacy Policy
                            </a>
                          </li>
                          <li>
                            <a href="https://acepoker.io/cookie-policy-2/">
                              Cookie Policy
                            </a>
                          </li>
                          <li>
                            <a href="https://acepoker.io/tearm-of-use/">
                              Tearm of use
                            </a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a href="https://acepoker.io/service/">Services</a>
                      </li>
                      <li>
                        <a href="https://acepoker.io/#footer">Contact</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="col-lg-auto d-sm-none  d-xl-block">
                  <div class="headerRightCol">
                    <span
                      onClick={() =>
                        connectWithMetamask({ chainId: ChainId.Arbitrum })
                      }
                      class="btn btnPrimary minWdBtn"
                    >
                      Connect
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <Register
          openRegister={openRegister}
          setOpenRegister={setOpenRegister}
          account={account}
        />
      </div>
      <DepositModal
        showTransactionModal={showTransactionModal}
        currencyType={currencyType}
        setShowTransactionModal={setShowTransactionModal}
        showSpinner={showSpinner}
        handleDepositAmt={handleDepositAmt}
        depositAmt={depositAmt}
        handleDepositTransaction={handleDepositTransaction}
        setCurrencType={setCurrencType}
      />
      <WithdrawlModal
        showWithdrawTransaction={showWithdrawTransaction}
        showSpinner={showSpinner}
        handleWithdrawTransaction={handleWithdrawTransaction}
        setShowWithdrawTransaction={setShowWithdrawTransaction}
        handleWithdrawAmt={handleWithdrawAmt}
        withdrawAmt={withdrawAmt}
      />
    </>
  );
};

export default Header;

const DepositModal = ({
  showTransactionModal,
  currencyType,
  showSpinner,
  handleDepositAmt,
  depositAmt,
  handleDepositTransaction,
  setShowTransactionModal,
  setCurrencType,
}) => {
  const options = [
    { value: "USDT", label: "USDT" },
    { value: "USDC", label: "USDC" },
    { value: "ETH", label: "ETH" },
  ];

  const handleCurrncySelect = (e) => {
    setCurrencType(e);
  };

  return (
    <Modal
      show={showTransactionModal}
      centered
      className="transaction-modalPopup fade casino-popup"
    >
      <Form.Label>Currency Type</Form.Label>
      <Modal.Body className="transaction-validatingTranction">
        <img src={deposit} alt="deposit" />
        {/* <Form.Label>Currency type</Form.Label>
                <Form.Select size="sm">
                    <option>USDT</option>
                    <option>USDC</option>
                    <option>ETH</option>
                </Form.Select> */}
        <Select
          value={currencyType}
          onChange={handleCurrncySelect}
          options={options}
        />
        <Form.Label>Deposit USDT</Form.Label>
        <Form.Control
          name="Deposit"
          onInput={handleDepositAmt}
          value={depositAmt}
          type="number"
          placeholder="Ex : 50"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShowTransactionModal(false);
          }}
        >
          Close
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={handleDepositTransaction}
          disabled={showSpinner}
        >
          {showSpinner ? <Spinner animation="border" /> : "Deposit"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const WithdrawlModal = ({
  showWithdrawTransaction,
  showSpinner,
  setShowWithdrawTransaction,
  handleWithdrawAmt,
  withdrawAmt,
  handleWithdrawTransaction,
}) => {
  // console.log("show spinner ==>", showSpinner);

  return (
    <Modal
      show={showWithdrawTransaction}
      centered
      className="transaction-modalPopup fade casino-popup"
    >
      <Modal.Body className="transaction-validatingTranction">
        <img src={withdraw} alt="" />
        <Form.Label>Withdraw Request For USDT</Form.Label>
        <Form.Control
          name="Deposit"
          onInput={handleWithdrawAmt}
          // onKeyDown={handleWithdrawAmt}
          value={withdrawAmt}
          type="text"
          placeholder="Ex : 50"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShowWithdrawTransaction(false);
          }}
        >
          Close
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={handleWithdrawTransaction}
          disabled={showSpinner}
        >
          {showSpinner ? <Spinner animation="border" /> : "Withdraw"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
