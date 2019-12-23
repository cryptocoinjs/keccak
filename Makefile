.PHONY: lint lint-js

format_cpp_files = src/addon.cc

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
