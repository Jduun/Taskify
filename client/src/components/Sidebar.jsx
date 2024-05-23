import React, { useState } from "react";
import axios, { HttpStatusCode } from "axios";
import AddBoard from "./AddBoard";
import TrashIcon from "../icons/TrashIcon";
import PencilIcon from "../icons/PencilIcon";
import EditBoard from "./EditBoard";
import SidebarItem from "./SidebarItem"

const Sidebar = ({ sidebarIsOpen, boards, setBoards, activeBoard, setActiveBoard }) => {
    const [editableBoard, setEditableBoard] = useState(null)

    return (
        <>
        {
            sidebarIsOpen ? (<div className="bg-mainColor-900 overflow-y-scroll overflow-x-hidden w-80">
                <div className="border-b">
                    <strong className="text-white m-2">My boards</strong>
                </div>
                <div
                    className="flex flex-col">
                    {boards.map((board) => (
                        <div key={board.id}>
                            {editableBoard !== board ? (
                                <SidebarItem
                                    board={board}
                                    setBoards={setBoards}
                                    activeBoard={activeBoard}
                                    setActiveBoard={setActiveBoard}
                                    setEditableBoard={setEditableBoard}
                                />
                            ) : (
                                <EditBoard
                                    editableBoard={editableBoard}
                                    setEditableBoard={setEditableBoard}
                                    setBoards={setBoards}
                                />
                            )
                            }
                        </div>
                    ))}
                </div>
                <div className="m-2">
                    <AddBoard setBoards={setBoards}/>
                </div>
            </div>) : (<> </>)}
        </>
    )
}

export default Sidebar
