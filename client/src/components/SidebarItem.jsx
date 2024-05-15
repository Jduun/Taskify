import React, {useState} from "react";
import TrashIcon from "../icons/TrashIcon";
import PencilIcon from "../icons/PencilIcon";
import axios from "axios";

const SidebarItem = ({ board, setBoardList, activeBoard, setActiveBoard, setEditableBoard }) => {
    // This is done for adaptive design
    const [showButton, setShowButton] = useState(false)

    const handleMouseEnter = () => setShowButton(true);
    const handleMouseLeave = () => setShowButton(false);
    const handleTouchStart = () => setShowButton(true);
    const handleTouchEnd = () => setShowButton(false);

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

    return (
        <div
            className={`hover:bg-violet-500/30 ${board.id === activeBoard.id ? "bg-violet-500/30" : "bg-mainColor-900"}`
                + " group relative border-b border-b-mainColor-300 cursor-pointer select-none"}>
            <div
                onClick={() => {
                    setActiveBoard(board)
                }}
                onMouseEnter={ handleMouseEnter }
                onMouseLeave={ handleMouseLeave }
                onTouchStart={ handleTouchStart }
                onTouchEnd={ handleTouchEnd }
                className="p-2 justify-center text-textColor text-start h-auto whitespace-pre-wrap break-words">
                {board.name}
            </div>
            { showButton ? (
            <>
                <div>
                    <button
                        onClick={() => { handleDeleteBoard(board) }}
                        onMouseEnter={ handleMouseEnter }
                        onMouseLeave={ handleMouseLeave }
                        className="absolute right-2 top-2 group-hover:opacity-100 transition-opacity
                                    duration-150 ease-in-out rounded-md stroke-white p-1 bg-mainColor-900 hover:bg-mainColor-300">
                        <TrashIcon />
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => {
                            setEditableBoard(board)
                            console.log("Editable board: ", board)
                        }}
                        onMouseEnter={ handleMouseEnter }
                        onMouseLeave={ handleMouseLeave }
                        className="absolute right-9 top-2 group-hover:opacity-100 transition-opacity
                             duration-150 ease-in-out rounded-md stroke-white p-1 bg-mainColor-900 hover:bg-mainColor-300">
                        <PencilIcon />
                    </button>
                </div>
            </>) : ( <></> )}
        </div>
    )
}

export default SidebarItem