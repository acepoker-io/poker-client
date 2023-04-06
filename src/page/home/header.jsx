import { useState }  from 'react'
// import { useHistory } from 'react-router-dom';
import numFormatter from "../../utils/utils";
import token from "../../assets/coin.png";
import tickets from "../../assets/tickets.png";
import { Button,OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "react-bootstrap";
import logo from "../../assets/game/logo.png";
import { FaQuestionCircle } from "react-icons/fa";
import { landingClient } from '../../config/keys';
// import { ethers } from "ethers";
import { toast } from 'react-toastify';
import { authInstance } from '../../utils/axios.config';
import Register from './registerPage';
import { useContext } from 'react';
import UserContext from '../../context/UserContext';
const Header = ({userData, handleShow}) => {
   const {user,setUser}=useContext(UserContext)
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
//const [balance, setBalance] = useState(null);
const [openRegister,setOpenRegister]=useState(false)
// const accountsChanged = async (newAccount) => {
//     setAccount(newAccount);
//     try {
//       const balance = await window.ethereum.request({
//         method: "eth_getBalance",
//         params: [newAccount.toString(), "latest"],
//       });
//       console.log("balance-->",balance)
//     //   setBalance(ethers.utils.formatEther(balance));
//     } catch (err) {
//       console.error(err);
//       toast.error("There was a problem connecting to MetaMask",{toastId:"connect"})
//     }
//   };
// useEffect(() => {
//     if (window.ethereum) {
//       window.ethereum.on("accountsChanged", accountsChanged);
//       window.ethereum.on("chainChanged", chainChanged);
//     }
//   }, []);
  const connectHandler = async () => {
    try { 
        if (window.ethereum) {
        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if(res[0]){
            setAccount(res[0])
         const resp=await authInstance().post('/loginWithMetamask',{
            metaMaskAddress:res[0]
         })
         console.log("Response--->",resp)
         const {status,message,token,user}=resp?.data
         if(status===200){
            setUser(user)
            localStorage.setItem('token',token)
         }
         if(status===401){
            toast.error(message,{toastId:"toastId"})
            setOpenRegister(true)
         }
        }
      
    } else {
        toast.error("Install MetaMask",{toastId:"Install meta"})  
    }
} catch (err) {
    console.error(err);
    toast.error("There was a problem connecting to MetaMask")
  }
  };
  
//   const chainChanged = () => {
//     setAccount(null);
//     setBalance(null);
//   };

    return (
        <div className="user-header">
            <div className="container">
                <div className="user-header-grid">
                    <div className="casino-logo">
                        <a href={landingClient}>
                            <img src={logo} alt="" />
                        </a>
                    </div>
                    <div className="create-game-box">
                        {user?<><a href={`${landingClient}profile`}>
                            <div className="create-game-box-avtar">
                                <img
                                    src={
                                        user?.profile ||
                                        "https://i.pinimg.com/736x/06/d0/00/06d00052a36c6788ba5f9eeacb2c37c3.jpg"
                                    }
                                    alt=""
                                />
                                <h5>{user?.username}</h5>
                            </div>
                        </a>
                        <div className="walletTicket-box">
                            <div className="pokerWallet-box">
                                <img src={token} alt="" className="pokerWallet" />
                                <span>{numFormatter(user?.wallet || 0)}</span>
                                <OverlayTrigger
                                   placement={window.innerWidth < 767 ? "right":"left"}
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
                                    placement={window.innerWidth < 767 ? "right":"left"}
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
                        </button></>:
                        <>
                        <button type="button"
                                className="create-game-boxBtn" onClick={() => connectHandler()}>Connect Metamask</button>
                        
                           
                        </>
                        }   
                    </div>
                    
                </div>
            </div>
            <Register openRegister={openRegister} setOpenRegister={setOpenRegister} account={account}/>
        </div>

    )
}

export default Header