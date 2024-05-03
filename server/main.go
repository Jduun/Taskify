package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"os"
	"server/pkg/handlers"
	"server/pkg/repositories"
	"server/pkg/utils"
)

func main() {
	var (
		serverPort string
		serverHost string
		ok         bool
		err        error
	)

	err = godotenv.Load("env_vars.env")
	if err != nil {
		log.Fatalf(".env file opening error: %s\n", err.Error())
	}

	utils.SecretKey, ok = os.LookupEnv("SECRET_KEY")
	serverPort, ok = os.LookupEnv("SERVER_PORT")
	serverHost, ok = os.LookupEnv("SERVER_HOST")
	if !ok {
		log.Fatalf("Couldn't read the environment variable\n")
	}

	if err = repositories.DBInit(); err != nil {
		log.Fatalf("Database connection error: %s\n", err.Error())
	}
	defer repositories.DB.Pool.Close()

	router := gin.Default()
	handlers.RoutesInit(router)

	if err = router.Run(serverHost + ":" + serverPort); err != nil {
		log.Fatalf("Failed to start server: %s\n", err.Error())
	}
}
