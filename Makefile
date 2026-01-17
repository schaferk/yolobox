BINARY ?= yolobox
CMD_DIR := ./cmd/yolobox
IMAGE ?= ghcr.io/finbarr/yolobox:latest
PREFIX ?= $(HOME)/.local
BINDIR ?= $(PREFIX)/bin
VERSION ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
LDFLAGS := -ldflags "-X main.Version=$(VERSION)"

.PHONY: build test lint image smoke-test install uninstall clean

build:
	go build $(LDFLAGS) -o $(BINARY) $(CMD_DIR)

test:
	go test -v ./...

lint:
	go vet ./...
	@which golangci-lint > /dev/null && golangci-lint run || echo "golangci-lint not installed, skipping"

image:
	@docker buildx version >/dev/null 2>&1 && \
		docker buildx build -t $(IMAGE) . || \
		docker build -t $(IMAGE) .

SMOKE_TOOLS := node bun python3 rustc cargo uv gh fish fd bat rg eza

smoke-test: build
	@echo "Running smoke tests..."
	@failed=0; \
	for tool in $(SMOKE_TOOLS); do \
		if ./$(BINARY) run --scratch $$tool --version >/dev/null 2>&1; then \
			echo "  ✓ $$tool"; \
		else \
			echo "  ✗ $$tool"; \
			failed=1; \
		fi; \
	done; \
	if ./$(BINARY) run --scratch go version >/dev/null 2>&1; then \
		echo "  ✓ go"; \
	else \
		echo "  ✗ go"; \
		failed=1; \
	fi; \
	[ $$failed -eq 0 ]
	@echo "Smoke tests passed!"

install: build
	mkdir -p $(BINDIR)
	install -m 0755 $(BINARY) $(BINDIR)/$(BINARY)
	@echo "Installed $(BINARY) to $(BINDIR)/$(BINARY)"

uninstall:
	rm -f $(BINDIR)/$(BINARY)
	@echo "Removed $(BINDIR)/$(BINARY)"

clean:
	rm -f $(BINARY)
