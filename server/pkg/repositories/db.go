package repositories

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"os"
	"sync"
)

type DBRepo struct {
	Mu   sync.Mutex
	Pool *pgxpool.Pool
}

func New(connStr string) (*DBRepo, error) {
	pool, err := pgxpool.New(context.Background(), connStr)
	if err != nil {
		return nil, err
	}
	return &DBRepo{Mu: sync.Mutex{}, Pool: pool}, nil
}

var DB *DBRepo

func DBInit() error {
	db, err := New(os.Getenv("DB_URL"))
	if err != nil {
		return err
	}
	DB = db
	return nil
}
