import { useDispatch } from "react-redux";
import { register, login, getMe, logout, updateProfile, changePassword } from "../service/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";


export function useAuth() {


    const dispatch = useDispatch()

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true))
            const data = await register({ email, username, password })
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Login failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to fetch user data"))
        } finally {
            dispatch(setLoading(false))
        }
    }
    

    async function handleLogout() {
        try {
            await logout()
            dispatch(setUser(null))
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Logout failed"))
        }
    }

    async function handleUpdateProfile({ username }) {
        try {
            const data = await updateProfile({ username })
            dispatch(setUser(data.user))
            return { success: true }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Update failed" }
        }
    }

    async function handleChangePassword({ currentPassword, newPassword }) {
        try {
            await changePassword({ currentPassword, newPassword })
            return { success: true }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || "Password change failed" }
        }
    }

    
    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout,
        handleUpdateProfile,
        handleChangePassword,
    }

}