import React from "react";

const Sidebar = ({ sidebarIsOpen, boardList, setBoardList, activeBoard, setActiveBoard }) => {
    if (sidebarIsOpen) {
        return (
            <div className="bg-neutral-800">
                <div
                    className="p-3">
                    <input type="search" placeholder="Search your board" className="bg-black text-white" />
                </div>
                <div
                    className="flex flex-col">
                    {boardList.map((board) => (
                        <div
                            key={board.id}
                            className={`hover:bg-neutral-900 ${board.id === activeBoard.id ? "bg-neutral-900" : "bg-neutral-800"}`}>
                            <button
                                onClick={() => {
                                    setActiveBoard(board)
                                }}
                                className="p-3 text-white w-full text-start">
                                {board.name}
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    className="text-white p-3">
                    Create new board
                </button>
            </div>
        )
    }
    return (
        <div>

        </div>
    )
}

export default Sidebar