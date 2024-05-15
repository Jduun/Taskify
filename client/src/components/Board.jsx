import React, { useState, useEffect } from "react";
import Column from "./Column";
import AddBoard from "./AddBoard";


const Board = () => {
    const [columnList, setColumnList] = useState([])

    const DEFAULT_CARDS = [
        // BACKLOG
        { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
        { title: "SOX compliance checklist", id: "2", column: "backlog" },
        { title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
        { title: "Document Notifications service", id: "4", column: "backlog" },
        // TODO
        {
            title: "Research DB options for new microservice",
            id: "5",
            column: "todo",
        },
        { title: "Postmortem for outage", id: "6", column: "todo" },
        { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },

        // DOING
        {
            title: "Refactor context providers to use Zustand",
            id: "8",
            column: "doing",
        },
        { title: "Add logging to daily CRON", id: "9", column: "doing" },
        // DONE
        {
            title: "Set up DD dashboards for Lambda listener",
            id: "10",
            column: "done",
        },
    ];
    const [cards, setCards] = useState(DEFAULT_CARDS)

    useEffect(() => {
        console.log(cards)
    }, [cards])

    const deleteCard = (cardId) => {
        setCards(cards.filter((c) => c.id !== cardId))
    }

    return (
        <div className="flex w-full gap-3 p-3 overflow-y-scroll">
            <Column
                title="Backlog"
                column="backlog"
                headingColor="text-neutral-500"
                cards={cards}
                setCards={setCards}
                deleteCard={deleteCard}
            />
            <Column
                title="TODO"
                column="todo"
                headingColor="text-yellow-200"
                cards={cards}
                setCards={setCards}
                deleteCard={deleteCard}
            />
            <Column
                title="In progress"
                column="doing"
                headingColor="text-blue-200"
                cards={cards}
                setCards={setCards}
                deleteCard={deleteCard}
            />
            <Column
                title="Complete"
                column="done"
                headingColor="text-emerald-200"
                cards={cards}
                setCards={setCards}
                deleteCard={deleteCard}
            />
            <AddBoard />
        </div>

    )
}

export default Board