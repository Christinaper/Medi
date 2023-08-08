import { useDispatch } from "react-redux"
import LoginUI from "./LoginUI/LoginUI"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {
  const dispatch = useDispatch()
  const [model, setModel] = useState({username: '', password: ''})
  const setName = (e) => {
    setModel({...model, username: e.target.value})
  }
  const setPwd = (e) => {
    setModel({...model, password: e.target.value})
  }
  const navigate = useNavigate()
  const loginHandler = () => {
    dispatch(userActions.login(model))
    setTimeout(() => {
      const token = sessionStorage.getItem('token')
      if(token) navigate('/home')
    }, 500)
    
  }
   return (
      <LoginUI setName={setName} setPwd={setPwd} loginHandler={loginHandler}></LoginUI>
  )
}
export default Login