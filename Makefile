.PHONY: setup
setup:
	./utilities/builder.zsh -t setup

.PHONY: build
build:
	./utilities/builder.zsh -t prod

.PHONY: dev
dev:
	./utilities/builder.zsh -t dev

.PHONY: deploy-no-promote
deploy-no-promote:
	./utilities/builder.zsh -t prod; cd ship; gcloud app deploy app.yaml --no-promote --quiet;

.PHONY: deploy-promote
deploy-promote:
	./utilities/builder.zsh -t prod; cd ship; gcloud app deploy app.yaml --promote --quiet;
