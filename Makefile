.PHONY: setup
setup:
	./utilities/builder.zsh -t setup

.PHONY: build
build:
	./utilities/builder.zsh -t prod

.PHONY: prod
prod:
	./utilities/builder.zsh -t prod; cd ship/; /usr/bin/python3 /usr/lib/google-cloud-sdk/bin/dev_appserver.py --runtime_python_path="python27=/usr/bin/python2.7,python3=/usr/bin/python3" .; cd ../..;

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
