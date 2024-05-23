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

type Column struct {
	ID      uint32 `json:"id"`
	BoardID uint32 `json:"board_id"`
	Name    string `json:"name"`
	Order   int    `json:"order"`
}

type Card struct {
	ID          uint32 `json:"id"`
	ColumnID    uint32 `json:"column_id"`
	Description string `json:"description"`
	Order       int    `json:"order"`
}
