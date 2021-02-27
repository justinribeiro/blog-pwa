.PHONY: setup
setup:
	./utilities/builder.zsh -t setup

.PHONY: build
build:
	./utilities/builder.zsh -t prod

.PHONY: prod
prod:
	./utilities/builder.zsh -t prod; cd ship/dist; ws --port=8080; cd ../..;

.PHONY: dev
dev:
	./utilities/builder.zsh -t dev

.PHONY: build-ci
build-ci:
	zsh ./utilities/builder.zsh -t setup; zsh ./utilities/builder.zsh -t prod; cd ship;

.PHONY: deploy-no-promote
deploy-no-promote:
	./utilities/builder.zsh -t prod; cd ship; gcloud app deploy app.yaml --no-promote --quiet;

.PHONY: deploy-promote
deploy-promote:
	./utilities/builder.zsh -t prod; cd ship; gcloud app deploy app.yaml --promote --quiet;
