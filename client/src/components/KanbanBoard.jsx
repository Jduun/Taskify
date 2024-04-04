import React, { useState } from "react";
import Board from "./Board";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const KanbanBoard = () => {
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

export default KanbanBoard