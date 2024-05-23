package repositories

import (
	"context"
	"server/pkg/models"
)

func NewColumn(column models.Column) error {
	_, err := DB.Pool.Exec(context.Background(), `
		insert into "column" (id, board_id, name, "order") 
		values ($1, $2, $3, $4);`,
		column.ID,
		column.BoardID,
		column.Name,
		column.Order,
	)
	return err
}

func GetBoardColumns(boardID uint32) ([]models.Column, error) {
	var columns []models.Column
	rows, err := DB.Pool.Query(context.Background(), `
		select * from "column" 
		where board_id = $1
		order by "order"`,
		boardID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var column models.Column
		if err := rows.Scan(&column.ID, &column.BoardID, &column.Name, &column.Order); err != nil {
			return nil, err
		}
		columns = append(columns, column)
	}
	return columns, nil
}

func UpdateBoardColumn(boardID uint32, columnID uint32, newColumnName string) error {
	_, err := DB.Pool.Exec(context.Background(), `
		update "column"
		set name = $1
		where board_id = $2 and id = $3;`,
		newColumnName,
		boardID,
		columnID,
	)
	return err
}

func DeleteBoardColumn(boardID uint32, columnID uint32) error {
	_, err := DB.Pool.Exec(context.Background(), `
		delete from "column" 
		where board_id=$1 and id = $2;`,
		boardID,
		columnID,
	)
	return err
}

func IsColumnOwnedByUser(columnID uint32, userID uint32) (bool, error) {
	var isOwned bool
	err := DB.Pool.QueryRow(context.Background(), `
		select exists (
			select 1
			from "user" u 
			join board b on u.id = b.user_id
			join column c on b.id = c.board_id
			where u.id = $1 and c.id = $2
		);
	`,
		userID,
		columnID,
	).Scan(&isOwned)
	return isOwned, err
}
