package models

type User struct {
	ID       uint32
	Username string
	Password string
	Salt     string
}
