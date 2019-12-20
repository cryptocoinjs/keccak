.PHONY: lint lint-js

standard = ./node_modules/.bin/standard


lint: lint-js

lint-js:
	$(standard)
