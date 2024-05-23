import React, {useEffect, useState} from "react";
import Board from "../components/Board";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import {useAuth} from "../utils/Auth";
import axios from "axios";
import {json} from "react-router-dom";

const HomePage = () => {
    const [sidebarIsOpen, setSidebarIsOpen] = useState(true)
    const [activeBoard, setActiveBoard] = useState(null)
    const [boards, setBoards] = useState([])

    useEffect(() => {
        axios.get('/api/boards', { withCredentials: true })
            .then(response => {
                const jsonStringBoards = response.data
                const jsonBoards = JSON.parse(jsonStringBoards)
                console.log("BOARDS: ", jsonBoards)
                if (jsonBoards !== null) {
                    setBoards(jsonBoards.sort((a, b) => a.name.localeCompare(b.name)))
                    setActiveBoard(jsonBoards[0])
                    console.log("active board:", activeBoard)
                }
            })
            .catch(error => console.log("Error:", error))
    }, []);

    console.log(activeBoard)
    //console.log(sidebarIsOpen)

    const toggleSidebar = () => {
        setSidebarIsOpen(!sidebarIsOpen)
    }

    return (
        <div className="h-screen flex flex-col">
            <Topbar
                activeBoard={activeBoard}
                toggleSidebar={toggleSidebar} />
            <div className="flex flex-grow overflow-y-hidden">
                <Sidebar
                    sidebarIsOpen={sidebarIsOpen}
                    boards={boards}
                    setBoards={setBoards}
                    activeBoard={activeBoard}
                    setActiveBoard={setActiveBoard}
                >
                </Sidebar>
                <Board
                    activeBoard={ activeBoard } />
            </div>
        </div>
    )
}

export default HomePage