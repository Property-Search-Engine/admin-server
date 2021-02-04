up: down
	docker-compose -f docker-compose-test.yaml up -d --scale node=0 && docker-compose -f docker-compose-test.yaml run node /bin/sh

run_start: down
	docker-compose -f docker-compose-test.yaml up -d --scale node=0 && docker-compose -f docker-compose-test.yaml run node npm run start

run_dev: down
	docker-compose -f docker-compose-test.yaml up -d --scale node=0 && docker-compose -f docker-compose-test.yaml run node npm run dev

test_watch: down
	docker-compose -f docker-compose-test.yaml up -d --scale node=0 && docker-compose -f docker-compose-test.yaml run node npm run test:watch

down:
	docker-compose -f docker-compose-test.yaml down

build:
	docker-compose -f docker-compose-test.yaml build
up_forward: down
	docker-compose -f docker-compose-test.yaml up -d --scale node=0 && docker-compose -f docker-compose-test.yaml -p 5000:5000 run node /bin/sh
