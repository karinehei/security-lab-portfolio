# Local lab commands. Intended for WSL (GNU Make + Bash) from the repository root.
# Windows: wsl -d Ubuntu-24.04 -- make help
#
# If docker pull fails with "error getting credentials":
#   make scan DOCKER_CONFIG=/tmp/empty-docker

SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := help

ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
API  := $(ROOT)/web-api-security/vulnerable-api
RAG  := $(ROOT)/ai-security-lab

SEMGREP_IMAGE  ?= semgrep/semgrep:1.128.1
GITLEAKS_IMAGE ?= zricethezav/gitleaks:v8.24.0
TRIVY_IMAGE    ?= aquasec/trivy:latest

DOCKER ?= docker
ifdef DOCKER_CONFIG
export DOCKER_CONFIG
endif

.PHONY: help install setup env typecheck test test-api test-rag \
	db-up db-down db-setup up up-secure down compose-config \
	api-dev audit semgrep gitleaks trivy scan check

help:
	@printf '%s\n' \
		'Usage: make <target>' \
		'' \
		'Setup' \
		'  install          npm ci in API and RAG labs' \
		'  env              copy API .env.example -> .env if missing' \
		'  db-up            start loopback Postgres (Compose db only)' \
		'  db-setup         migrate + seed (Postgres must be up)' \
		'  setup            install + env + db-up + db-setup' \
		'' \
		'Run' \
		'  up               Compose API+db, LAB_MODE=vulnerable (loopback)' \
		'  up-secure        Compose API+db, LAB_MODE=secure' \
		'  down             stop Compose stack' \
		'  api-dev          host API (tsx watch); needs db-up + db-setup' \
		'' \
		'Verify' \
		'  typecheck        tsc --noEmit in both labs' \
		'  test             dual-mode Vitest in both labs (needs Postgres)' \
		'  test-api / test-rag' \
		'  check            typecheck + test' \
		'  compose-config   docker compose config (API lab)' \
		'' \
		'Scan (Docker images, local only)' \
		'  audit            npm audit --audit-level=high (API)' \
		'  semgrep          policy + lab-coverage assert' \
		'  gitleaks         secrets scan' \
		'  trivy            filesystem vuln scan (skip node_modules)' \
		'  scan             semgrep + gitleaks + trivy + audit'

install:
	cd "$(API)" && npm ci
	cd "$(RAG)" && npm ci

env:
	test -f "$(API)/.env" || cp "$(API)/.env.example" "$(API)/.env"

db-up:
	cd "$(API)" && $(DOCKER) compose up -d db

db-down:
	cd "$(API)" && $(DOCKER) compose down

db-setup: env
	cd "$(API)" && npx prisma generate && npm run db:setup

setup: install env db-up
	@printf 'Waiting for Postgres...\n'
	@for i in 1 2 3 4 5 6 7 8 9 10 11 12; do \
		$(DOCKER) compose -f "$(API)/docker-compose.yml" exec -T db pg_isready -U lab -d documents_lab && break; \
		sleep 2; \
	done
	$(MAKE) db-setup

up:
	cd "$(API)" && $(DOCKER) compose up --build

up-secure:
	cd "$(API)" && LAB_MODE=secure $(DOCKER) compose up --build

down:
	cd "$(API)" && $(DOCKER) compose down

compose-config:
	cd "$(API)" && $(DOCKER) compose config

api-dev:
	cd "$(API)" && npm run dev

typecheck:
	cd "$(API)" && npm run typecheck
	cd "$(RAG)" && npm run typecheck

test: test-api test-rag

test-api:
	cd "$(API)" && npm test

test-rag:
	cd "$(RAG)" && npm test

check: typecheck test

audit:
	cd "$(API)" && npm run audit:ci

semgrep:
	$(DOCKER) run --rm -v "$(ROOT):/src" -w /src --entrypoint semgrep $(SEMGREP_IMAGE) \
		scan --config /src/devsecops/semgrep/policy.yaml --error --severity ERROR --metrics=off
	$(DOCKER) run --rm -v "$(ROOT):/src" -w /src --entrypoint semgrep $(SEMGREP_IMAGE) \
		scan --config /src/devsecops/semgrep/lab-coverage.yaml --json -o /src/semgrep-lab.json --metrics=off
	python3 "$(ROOT)/devsecops/ci/assert-lab-sast.py" "$(ROOT)/semgrep-lab.json"
	rm -f "$(ROOT)/semgrep-lab.json"

gitleaks:
	$(DOCKER) run --rm -v "$(ROOT):/repo" $(GITLEAKS_IMAGE) \
		detect --source /repo --config /repo/devsecops/gitleaks/gitleaks.toml --verbose

trivy:
	$(DOCKER) run --rm -v "$(ROOT):/src" -w /src $(TRIVY_IMAGE) fs \
		--skip-dirs /src/web-api-security/vulnerable-api/node_modules \
		--skip-dirs /src/ai-security-lab/node_modules \
		--scanners vuln \
		/src

scan: semgrep gitleaks trivy audit
