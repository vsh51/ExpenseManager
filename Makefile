run:
	sudo docker compose up --build

dev-stop:
	sudo docker compose down --rmi local

stop:
	sudo docker compose down --volumes --rmi local
