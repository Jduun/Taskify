package models

type User struct {
	ID       int
	Email    string
	Username string
	Password string
	Salt     string
}
