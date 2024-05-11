package models

type User struct {
	ID       uint32
	Username string
	Password string
	Salt     string
}

type Board struct {
	ID   uint32
	Name string
}
