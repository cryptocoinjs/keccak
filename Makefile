.PHONY: coverage coverage-lcov format format-cpp lint lint-cpp lint-js test unit


nyc = ./node_modules/.bin/nyc

coverage:
	$(nyc) node test/index.js

coverage-lcov: coverage
	$(nyc) report -r lcov


format_cpp_files = ./src/addon.cc

format: format-cpp

format-cpp:
	clang-format -i -verbose $(format_cpp_files)


standard = ./node_modules/.bin/standard
lint_dir = build/lint

lint: lint-cpp lint-js

lint-cpp:
	mkdir -p $(lint_dir)/cpp/src
	rsync -a --delete src/ $(lint_dir)/cpp/src
	cd $(lint_dir)/cpp && clang-format -i -verbose $(format_cpp_files)
	git diff --no-index --exit-code src $(lint_dir)/cpp/src

lint-js:
	$(standard)


test: lint unit


unit:
	node test/index.js
