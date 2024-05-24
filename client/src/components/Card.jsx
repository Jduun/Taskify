import React from "react";
import DropIndicator from "./DropIndicator";
import TrashIcon from "../icons/TrashIcon";

const Card = ({ description, id, columnID, handleDragStart, deleteCard }) => {
    return (
        <div>
            <DropIndicator beforeId={id} columnID={columnID} />
            <div
                draggable="true"
                onDragStart={(e) => handleDragStart(e, { description, id, columnID })}
                className="group relative cursor-grab rounded border-2 border-white hover:border-extraColor bg-mainColor-700 p-3 active:cursor-grabbing"
            >
                <div>
                    <p className="text-sm text-textColor h-auto whitespace-pre-wrap break-words select-none">
                        {description}
                    </p>
                </div>
                <div>
                    <button
                        onClick={() => { deleteCard(id) }}
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity
                        duration-150 ease-in-out rounded-md stroke-white p-1 bg-mainColor-700 hover:bg-mainColor-300"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card