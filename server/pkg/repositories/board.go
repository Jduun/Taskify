package repositories

import (
	"context"
	"server/pkg/models"
)

func NewBoard(board models.Board) error {
	_, err := DB.Pool.Exec(context.Background(), `
		insert into board (id, user_id, name) 
		values ($1, $2, $3);`,
		board.ID,
		board.UserID,
		board.Name,
	)
	return err
}

func GetAllUserBoards(userID uint32) ([]models.Board, error) {
	var boards []models.Board
	rows, err := DB.Pool.Query(context.Background(), `
		select * from board
		where user_id = $1;`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var board models.Board
		if err := rows.Scan(&board.ID, &board.UserID, &board.Name); err != nil {
			return nil, err
		}
		boards = append(boards, board)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return boards, nil
}

func DeleteBoard(boardID uint32) error {
	_, err := DB.Pool.Exec(context.Background(), `
		delete from board 
		where id = $1;`,
		boardID,
	)
	return err
}

func UpdateBoard(boardID uint32, newBoardName string) error {
	_, err := DB.Pool.Exec(context.Background(), `
		update board
		set name = $1
		where id = $2;`,
		newBoardName,
		boardID,
	)
	return err
}
