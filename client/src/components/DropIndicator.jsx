import React from "react";

const DropIndicator = ({ beforeID, columnID }) => {
    return (
        <div
            data-before={beforeID|| -1}
            data-column={columnID}
            className="my-0.5 h-0.5 w-full bg-violet-600 opacity-0"
        />
    )
}

export default DropIndicator