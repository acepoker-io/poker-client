import { useEffect, useState } from 'react'
import numFormatter from "../../utils/utils";
import token from "../../assets/coin.png";
import tickets from "../../assets/tickets.png";
import { Button, Form, Modal, OverlayTrigger, Spinner } from "react-bootstrap";
import { Tooltip } from "react-bootstrap";
import logo from "../../assets/game/logo.png";
import { FaQuestionCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import { authInstance } from '../../utils/axios.config';
import Register from './registerPage';
import { useContext } from 'react';
import UserContext from '../../context/UserContext';
import { ChainId, useAddress, useMetamask, useDisconnect } from "@thirdweb-dev/react";
import { clientUrl } from '../../config/keys';

const Header = ({ userData, handleShow, handleDeposit }) => {
    const { user, setUser } = useContext(UserContext);
    const disconnect = useDisconnect();
    const connectWithMetamask = useMetamask();
    const address = useAddress()
    const renderWallet = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            This is your token balance, and can be used for betting.
        </Tooltip>
    );
    const renderTicket = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            This is your ticket balance and can be redeemed for prizes.
        </Tooltip>
    );
    const [account, setAccount] = useState(null);
    const [openRegister, setOpenRegister] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [depositAmt, setDepositAmt] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);


    useEffect(() => {
        const connectHandler = async () => {
            try {
                if (address) {
                    setAccount(address)
                    const resp = await authInstance().post('/loginWithMetamask', {
                        metaMaskAddress: address
                    })
                    console.log("Response--->", resp)
                    const { status, message, token, user } = resp?.data
                    if (status === 200) {
                        setUser(user)
                        localStorage.setItem('token', token)
                    }
                    if (status === 401) {
                        toast.error(message, { toastId: "toastId" })
                        setOpenRegister(true)
                    }
                }
            } catch (err) {
                console.error(err);
                toast.error("There was a problem connecting to MetaMask")
            }
        };
        /* disable eslint react-hooks/exhaustive-deps */
        connectHandler();
    }, [address, setUser])


    const handleLogOut = () => {
        console.log("logout executed");
        disconnect()
        localStorage.clear();
        // history.push("/");
        window.location.href = "/";
    }

    const handleDepositAmt = (e) => {
        let amt = e.target.value;
        console.log("amt ==>", amt);
        if (amt.toString().includes("-")) {
            amt = amt.replace("-", "");
        }
        setDepositAmt(amt)
    }

    const handleShowDepositPopUp = () => {
        setShowTransactionModal(true);
        setDepositAmt("");
    }

    const handleDepositTransaction = async () => {
        setShowSpinner(true);
        try {
            await handleDeposit(depositAmt);
            // if(resp)
            setShowSpinner(false);
            setShowTransactionModal(false);
            setDepositAmt("");
        } catch (e) {
            setShowSpinner(false);
            setShowTransactionModal(false);
            console.log("erroor in  handle transaction deposit", e)
        }
    }

    //   const chainChanged = () => {
    //     setAccount(null);
    //     setBalance(null);
    //   };

    console.log("User in address ===>", user)

    return (
        <>
            <div className="user-header">
                <div className="container">
                    <div className="user-header-grid">
                        <div className="casino-logo">
                            <a href={clientUrl}><img src={logo} alt="" /></a>
                        </div>
                        <div className="create-game-box">
                            {user ? <>
                                {/* <a href={`${landingClient}profile`}> */}
                                <button onClick={handleShowDepositPopUp}>Deposit</button>
                                <button>Withdraw</button>
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
                                {/* </a> */}
                                <div className="walletTicket-box">
                                    <div className="pokerWallet-box">
                                        <img src={token} alt="" className="pokerWallet" />
                                        <span>{numFormatter(user?.wallet || 0)}</span>
                                        <OverlayTrigger
                                            placement={window.innerWidth < 767 ? "right" : "left"}
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={renderWallet}
                                        >
                                            <Button variant="success">
                                                <FaQuestionCircle />
                                            </Button>
                                        </OverlayTrigger>
                                    </div>
                                    <div className="pokerWallet-box">
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
                                    </div>
                                </div><button
                                    type="button"
                                    className="create-game-boxBtn"
                                    onClick={handleShow}
                                >
                                    Create Game
                                </button><button
                                    type="button"
                                    className="create-game-boxBtn"
                                    onClick={handleLogOut}
                                >
                                    Logout
                                </button></> :
                                <>
                                    <button type="button"
                                        className="create-game-boxBtn" onClick={() => connectWithMetamask({ chainId: ChainId.ArbitrumGoerli })}>Connect Metamask</button>
                                </>
                            }
                        </div>

                    </div>
                </div>
                <Register openRegister={openRegister} setOpenRegister={setOpenRegister} account={account} />
            </div >
            <TransactionModal showTransactionModal={showTransactionModal} setShowTransactionModal={setShowTransactionModal} showSpinner={showSpinner} handleDepositAmt={handleDepositAmt} depositAmt={depositAmt} handleDepositTransaction={handleDepositTransaction} />
        </>
    )
}

export default Header

const TransactionModal = ({ showTransactionModal, showSpinner, handleDepositAmt, depositAmt, handleDepositTransaction, setShowTransactionModal }) => {


    return (
        <Modal
            show={showTransactionModal}
            centered
            className="transaction-modalPopup"
        >
            <Modal.Body className="transaction-validatingTranction">
                <Form.Label>Deposit amount</Form.Label>
                <Form.Control
                    name="Deposit"
                    onInput={handleDepositAmt}
                    value={depositAmt}
                    type="number"
                    placeholder="Ex : 50"
                />

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { setShowTransactionModal(false) }}>Close</Button>
                <Button variant="primary" type="submit" onClick={handleDepositTransaction} disabled={showSpinner} >
                    {showSpinner ? <Spinner animation="border" /> : "Deposit"}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}


