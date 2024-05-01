package repositories

import (
	"context"
	"server/pkg/models"
)

func NewUser(user models.User) error {
	_, err := DB.Pool.Exec(context.Background(), `
		insert into "user" (id, username, password, salt) 
		values ($1, $2, $3, $4);`,
		user.ID,
		user.Username,
		user.Password,
		user.Salt,
	)
	return err
}

func FindUser(username string) (*models.User, error) {
	var user models.User
	err := DB.Pool.QueryRow(context.Background(), `
		select id, username, password, salt 
		from "user" 
		where username = $1;`,
		username,
	).Scan(&user.ID, &user.Username, &user.Password, &user.Salt)
	return &user, err
}
