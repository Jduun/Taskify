package main

import (
	"database/sql"
	"fmt"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"io"
	"net/http"
	"os"
)

func handleSignIn(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	fmt.Println(string(body), err)
}

func handleSignUp(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	fmt.Println(string(body), err)
}

func main() {
	var err error
	err = godotenv.Load("env_vars.env")
	if err != nil {
		fmt.Println(".env file opening error")
	}

	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	fmt.Println("Database:", host, port, user, password, dbname)

	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s", host, port, user, password, dbname)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		fmt.Println("Database connection error:", err)
	}
	defer db.Close()

	router := http.NewServeMux()
	router.HandleFunc("POST /api/signin", handleSignIn)
	router.HandleFunc("POST /api/signup", handleSignUp)

	server := http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	fmt.Println("Server listening on port 8080")

	err = server.ListenAndServe()
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}
