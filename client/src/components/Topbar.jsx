import React from "react";
import LogoutIcon from "../icons/LogoutIcon";
import Bars3Icon from "../icons/Bars3Icon";
import {useAuth} from "../utils/Auth";
import { useNavigate } from "react-router-dom";

const Topbar = ({ boardName, toggleSidebar }) => {
    const auth = useAuth()
    const navigate = useNavigate()

    return (
        <header className="bg-neutral-900 p-3">
            <div className="flex justify-between items-center">
                <button
                    onClick={toggleSidebar}
                    className="hover:bg-neutral-700 rounded-md p-1">
                    <Bars3Icon />
                </button>
                <strong className="text-white">
                    {boardName}
                </strong>
                <button
                    onClick={ async () => {
                        try {
                            const responseStatus = await auth.signOut();
                            console.log('Cтатус успешного выхода из аккаунта: ', responseStatus)
                            navigate('/auth')
                        } catch (errorResponseStatus) {
                            console.error('Статус ошибки выхода:', errorResponseStatus);
                        }
                    }}
                    className="hover:bg-neutral-700 rounded-md p-1">
                    <LogoutIcon />
                </button>
            </div>
        </header>
    )
}

export default Topbar
