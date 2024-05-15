import React, { useState } from "react";
import axios, { HttpStatusCode } from "axios";
import AddBoard from "./AddBoard";
import TrashIcon from "../icons/TrashIcon";
import PencilIcon from "../icons/PencilIcon";
import EditBoard from "./EditBoard";
import SidebarItem from "./SidebarItem"

const Sidebar = ({ sidebarIsOpen, boardList, setBoardList, activeBoard, setActiveBoard }) => {
    const [editableBoard, setEditableBoard] = useState(null)

    if (sidebarIsOpen) {
        return (
            <div className="bg-mainColor-900 overflow-y-scroll overflow-x-hidden w-80">
                <div className="border-b">
                    <strong className="text-white m-2">My boards</strong>
                </div>
                <div
                    className="flex flex-col">
                    {boardList.map((board) => (
                        <div
                            key={board.id}
                            >
                            { editableBoard !== board ? (
                                <SidebarItem
                                    board={board}
                                    setBoardList={ setBoardList }
                                    activeBoard={ activeBoard }
                                    setActiveBoard={ setActiveBoard }
                                    setEditableBoard={ setEditableBoard }
                                />
                                 ) : (
                                <EditBoard
                                    editableBoard={ editableBoard }
                                    setEditableBoard={ setEditableBoard } />
                                )
                            }
                        </div>
                    ))}
                </div>

                <div className="m-2">
                    <AddBoard setBoardList={setBoardList}/>
                </div>

            </div>
        )
    }
    return (
        <div>

        </div>
    )
}

export default Sidebar

/*
                <button
                    className="text-white p-3"
                    onClick={ async () => {
                        try {
                            const response = await axios.post('/api/boards', {
                                withCredentials: true // Send cookies with the request
                            });
                            if (response.status === HttpStatusCode.Ok) {
                                console.log('The board has been successfully created', response.status)
                            }
                        } catch (errorResponse) {
                            if (errorResponse.status === HttpStatusCode.Conflict) {
                                console.error('Board with that name already exists', errorResponse.status);
                            }
                        }
                    }}
                >
                    Create new board
                </button>
 */

/*group relative
                            <div>
                                <button
                                    onClick={() => {

                                    }}
                                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity
                        duration-150 ease-in-out rounded-md stroke-white p-1 bg-neutral-800 hover:bg-neutral-700"
                                >
                                    <TrashIcon/>
                                </button>
                            </div>
 */