import React, { useState } from "react";
import axios, { HttpStatusCode } from "axios";
import AddBoard from "./AddBoard";
import TrashIcon from "../icons/TrashIcon";
import PencilIcon from "../icons/PencilIcon";
import EditBoard from "./EditBoard";

const Sidebar = ({ sidebarIsOpen, boardList, setBoardList, activeBoard, setActiveBoard }) => {
    const [editableBoard, setEditableBoard] = useState(null)

    const handleDeleteBoard = (board) => {
        console.log("Delete the board", board)
        axios.delete(`/api/boards/${board.id}`, { withCredentials: true })
            .then(response => {
                console.log("Board successfully deleted", response)
                setBoardList(boardList => boardList.filter(currBoard => currBoard.id !== board.id))
            })
            .catch(error => {
                console.log("Error:", error)
            })
    }

    if (sidebarIsOpen) {
        return (
            <div className="bg-mainColor-900 overflow-y-scroll overflow-x-hidden w-80">
                {//<div
                  //  className="p-3">
                   // <input type="search" placeholder="Search your board" className="bg-black text-textColor" />
                //</div>
                    }
                <div
                    className="flex flex-col">
                    {boardList.map((board) => (
                        <div
                            key={board.id}
                            >
                            { editableBoard !== board ? (
                                <div className={`hover:bg-violet-500/30 ${board.id === activeBoard.id ? "bg-violet-500/30" : "bg-mainColor-900"}`
                                + " group relative border-b border-b-mainColor-300 cursor-pointer"}>
                                    <div
                                        onClick={() => {
                                            setActiveBoard(board)
                                        }}
                                        className="p-2 justify-center text-textColor text-start h-auto whitespace-pre-wrap break-words">
                                        {board.name}
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleDeleteBoard(board)}
                                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity
                                duration-150 ease-in-out rounded-md stroke-white p-1 bg-mainColor-900 hover:bg-mainColor-300"
                                        >
                                            <TrashIcon/>
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => {
                                                setEditableBoard(board)
                                                console.log("Editable board: ", board)
                                            }}
                                            className="absolute right-9 top-2 opacity-0 group-hover:opacity-100 transition-opacity
                                duration-150 ease-in-out rounded-md stroke-white p-1 bg-mainColor-900 hover:bg-mainColor-300"
                                        >
                                            <PencilIcon />
                                        </button>
                                    </div>
                                </div> ) : (
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