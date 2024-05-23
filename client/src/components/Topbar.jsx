import React from "react";
import LogoutIcon from "../icons/LogoutIcon";
import Bars3Icon from "../icons/Bars3Icon";
import { useAuth } from "../utils/Auth";
import { useNavigate } from "react-router-dom";

const Topbar = ({ activeBoard, toggleSidebar }) => {
    const auth = useAuth()
    const navigate = useNavigate()

    return (
        <header className="bg-mainColor-900 p-3">
            <div className="flex justify-between items-center">
                <button
                    onClick={ toggleSidebar }
                    className="active:bg-mainColor-300 rounded-md p-1 bg-mainColor-900">
                    <Bars3Icon />
                </button>
                <strong className="text-white overflow-ellipsis">
                    {activeBoard === null ? "" : activeBoard.name}
                </strong>
                <div className="flex flex-row">
                    <p className="text-white hover:text-purple-700 cursor-pointer">{auth.username}</p>
                    <button
                        onClick={async () => {
                            try {
                                const responseStatus = await auth.signOut();
                                console.log('Cтатус успешного выхода из аккаунта: ', responseStatus)
                                navigate('/auth')
                            } catch (errorResponseStatus) {
                                console.error('Статус ошибки выхода:', errorResponseStatus);
                            }
                        }}
                        className="hover:bg-mainColor-300 rounded-md p-1">
                        <LogoutIcon/>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Topbar
