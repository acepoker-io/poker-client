import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { updateProfileSchema } from '../../utils/validationSchema'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import { authInstance } from '../../utils/axios.config'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import UserContext from '../../context/UserContext'
const Register = ({ openRegister, setOpenRegister, account }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onBlur', resolver: yupResolver(updateProfileSchema) })
  const {setUser}=useContext(UserContext)
  const [showSpinner, setSpinner] = useState(false)
  const registerUser = async (values) => {
    try {
      setSpinner(true)
      const resp=await authInstance().post('/register',{...values,metaMaskAddress:account})
      setSpinner(false)
      if(resp?.data){
        const {user,token}=resp?.data
        console.log(token)
        setOpenRegister(false)
        reset()
        localStorage.setItem('token',token)
        setUser(user)
      }
    } catch (err) {
      setSpinner(false)
      toast.error("Internal server error",{toastId:"register"})
    }
  }
  const handleClose = () => {
    setOpenRegister(false)
    reset()
  }
  return (
    <>
      <Modal
        show={openRegister}
        onHide={() => setOpenRegister(false)}
        centered
        className="casino-popup"
      >
        <Form onSubmit={handleSubmit(registerUser)}>
          <Modal.Header closeButton>
            <Modal.Title className="text-dark">Registration</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group
              className="form-group"
              controlId="formPlaintextPassword"
            >
              <Form.Label>First Name</Form.Label>
              <Form.Control
                name="firstName"
                type="text"
                placeholder="First Name"
                {...register('firstName')}
              />
              {errors?.firstName && (
                <p className="text-danger">{errors?.firstName?.message}</p>
              )}
            </Form.Group>
            <Form.Group
              className="form-group"
              controlId="formPlaintextPassword"
            >
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                name="lastName"
                type="test"
                placeholder="Last Name"
                {...register('lastName')}
              />
              {errors?.lastName && (
                <p className="text-danger">{errors?.lastName?.message}</p>
              )}
            </Form.Group>

            <Form.Group
              className="form-group"
              controlId="formPlaintextPassword"
            >
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                type="text"
                placeholder="username"
                {...register('username')}
              />
              {errors?.username && (
                <p className="text-danger">{errors?.username?.message}</p>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="Email"
                {...register('email')}
              />

              {errors?.email && (
                <p className="text-danger">{errors?.email?.message}</p>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Password"
                {...register('password')}
              />

              {errors?.password && (
                <p className="text-danger">{errors?.password?.message}</p>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                name="confPassword"
                type="password"
                placeholder="Confirm password"
                {...register('confPassword')}
              />

              {errors?.confPassword && (
                <p className="text-danger">{errors?.confPassword?.message}</p>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              {showSpinner ? <Spinner animation="border" /> : 'Register'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
export default Register
