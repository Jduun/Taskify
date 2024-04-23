package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"os"
	"server/pkg/handlers"
	"server/pkg/repositories"
)

func main() {
	var err error
	err = godotenv.Load("env_vars.env")
	if err != nil {
		log.Fatalf(".env file opening error: %s\n", err.Error())
	}

	if err = repositories.DBInit(); err != nil {
		log.Fatalf("Database connection error: %s\n", err.Error())
	}
	defer repositories.DB.Pool.Close()

	router := gin.Default()
	handlers.RoutesInit(router)

	serverPort := os.Getenv("SERVER_PORT")
	serverHost := os.Getenv("SERVER_HOST")

	if err = router.Run(serverHost + ":" + serverPort); err != nil {
		log.Fatalf("Failed to start server: %s\n", err.Error())
	}
}
