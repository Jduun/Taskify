package repositories

import (
	"context"
	"server/pkg/models"
)

func NewUser(user models.User) error {
	_, err := DB.Pool.Exec(context.Background(), `
		insert into "user" (email, username, password, salt) 
		values ($1, $2, $3, $4);`,
		user.Email,
		user.Username,
		user.Password,
		user.Salt,
	)
	return err
}
