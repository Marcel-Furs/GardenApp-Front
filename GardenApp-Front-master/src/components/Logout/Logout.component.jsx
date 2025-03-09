import { useContext, useEffect } from "react";
import { LoginContext } from "../../context/LoginContext";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'

function Logout() {
    const [token, setToken] = useContext(LoginContext)
    const navigate = useNavigate()

    useEffect(() => {
        toast.success("Wylogowano")
        localStorage.removeItem("token")
        setToken(null)
        navigate("/login")
    })

    return null
}

export default Logout;