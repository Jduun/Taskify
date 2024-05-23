package repositories

import (
	"context"
	"server/pkg/models"
)

func NewCard(card models.Card) error {
	_, err := DB.Pool.Exec(context.Background(), `
		insert into "card" (id, column_id, description, "order") 
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
		select * from "card" 
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

func UpdateCard(cardID uint32, newCardDescription string) error {
	_, err := DB.Pool.Exec(context.Background(), `
		update card
		set description = $1
		where id = $2;`,
		newCardDescription,
		cardID,
	)
	return err
}

func DeleteCard(cardID uint32) error {
	_, err := DB.Pool.Exec(context.Background(), `
		delete from card 
		where id = $1;`,
		cardID,
	)
	return err
}
