import React, { useState } from "react";
import Board from "../components/Board";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import {useAuth} from "../utils/Auth";

const HomePage = () => {
    const auth = useAuth()
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false)
    const [activeBoard, setActiveBoard] = useState({ "id": 1, "name": "Board 1" })
    const [boardList, setBoardList] = useState([
        { "id": 1, "name": "Board 1" },
        { "id": 2, "name": "Board 2" },
        { "id": 3, "name": "Board 3" },
        { "id": 4, "name": "Board 4" }])

    console.log(activeBoard)
    //console.log(sidebarIsOpen)

    const toggleSidebar = () => {
        setSidebarIsOpen(!sidebarIsOpen)
    }

    return (
        <div className="h-screen flex flex-col">
            <p className="text-red-600">{ auth.username }</p>
            <Topbar
                boardName={activeBoard.name}
                toggleSidebar={toggleSidebar} />
            <div className="flex flex-grow">
                <Sidebar
                    sidebarIsOpen={sidebarIsOpen}
                    boardList={boardList}
                    setBoardList={setBoardList}
                    activeBoard={activeBoard}
                    setActiveBoard={setActiveBoard}
                >
                </Sidebar>
                <Board />
            </div>
        </div>
    )
}

export default HomePage