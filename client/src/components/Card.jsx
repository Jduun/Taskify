import React from "react";
import DropIndicator from "./DropIndicator";
import TrashIcon from "../icons/TrashIcon";

const Card = ({ title, id, column, handleDragStart, deleteCard }) => {
    return (
        <div>
            <DropIndicator beforeId={id} column={column} />
            <div
                draggable="true"
                onDragStart={(e) => handleDragStart(e, { title, id, column })}
                className="group relative cursor-grab rounded border border-white hover:border-violet-600 bg-mainColor-700 p-3 active:cursor-grabbing
                            hover:bg-extraColor"
            >
                <div>
                    <p className="text-sm text-textColor h-auto whitespace-pre-wrap break-words select-none">
                        {title}
                    </p>
                </div>
                <div>
                    <button
                        onClick={() => { deleteCard(id) }}
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity
                        duration-150 ease-in-out rounded-md stroke-white p-1 bg-mainColor-700 active:bg-mainColor-300"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card