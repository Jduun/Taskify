import React from "react";
import LogoutIcon from "../icons/LogoutIcon";
import Bars3Icon from "../icons/Bars3Icon";

const Topbar = ({ boardName, toggleSidebar }) => {
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
                <button className="hover:bg-neutral-700 rounded-md p-1">
                    <LogoutIcon />
                </button>
            </div>
        </header>
    )
}

export default Topbar