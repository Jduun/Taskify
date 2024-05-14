package models

type User struct {
	ID       uint32 `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Salt     string `json:"salt"`
}

type Board struct {
	ID     uint32 `json:"id"`
	UserID uint32 `json:"user_id"`
	Name   string `json:"name"`
}
