.PHONY: build
build:
	@echo "Building image"
	docker image rm balance-app && docker build -t balance-app .