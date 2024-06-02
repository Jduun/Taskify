package repositories

import (
	"context"
	"fmt"
	"server/pkg/models"
)

func NewCard(card models.Card) error {
	_, err := DB.Pool.Exec(context.Background(), `
		insert into card (id, column_id, description, "order") 
		values ($1, $2, $3, $4);`,
		card.ID,
		card.ColumnID,
		card.Description,
		card.Order,
	)
	return err
}

func GetColumnCards(columnID uint32) ([]models.Card, error) {
	var cards []models.Card
	rows, err := DB.Pool.Query(context.Background(), `
		select * from card 
		where column_id = $1
		order by "order"`,
		columnID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var card models.Card
		if err := rows.Scan(&card.ID, &card.ColumnID, &card.Description, &card.Order); err != nil {
			return nil, err
		}
		cards = append(cards, card)
	}
	return cards, nil
}

func UpdateColumnCard(columnID, cardID uint32, newCardDescription string) error {
	_, err := DB.Pool.Exec(context.Background(), `
		update card
		set description = $1
		where id = $2 and column_id = $3;`,
		newCardDescription,
		cardID,
		columnID,
	)
	return err
}

func DeleteColumnCard(columnID, cardID uint32) error {
	_, err := DB.Pool.Exec(context.Background(), `
		delete from card 
		where id = $1 and column_id = $2;`,
		cardID,
		columnID,
	)
	return err
}

func MoveColumnCard(columnID, newColumnID, cardID uint32, description string, order int) error {
	tx, err := DB.Pool.Begin(context.Background())
	if err != nil {
		return fmt.Errorf("error starting transaction: %s", err)
	}
	defer tx.Rollback(context.Background())

	_, err = tx.Exec(context.Background(), `
		delete from card 
		where id = $1 and column_id = $2;`,
		cardID,
		columnID,
	)
	if err != nil {
		return fmt.Errorf("error moving card: %s", err)
	}

	_, err = tx.Exec(context.Background(), `
		insert into card (id, column_id, description, "order") 
		values ($1, $2, $3, $4);
		`,
		cardID,
		newColumnID,
		description,
		order,
	)
	if err != nil {
		return fmt.Errorf("error moving card: %s", err)
	}

	err = tx.Commit(context.Background())
	if err != nil {
		return fmt.Errorf("unable to commit transaction: %v", err)
	}

	return nil
}

/*
func MoveColumnCard(columnID, cardID, newColumnID uint32, order int) error {
	_, err := DB.Pool.Exec(context.Background(), `
		update card
		set column_id = $1, "order" = $2
		where id = $3 and column_id = $4;`,
		newColumnID,
		order,
		cardID,
		columnID,
	)
	return err
}
*/
