#!/usr/bin/env bash
# Builds the test's starting state in the current directory: session.md and memory/
# as given, and project/ as a git repo replayed from files/commits/ (plus files/wip/,
# left uncommitted). Fixture files named *.fixture lose that suffix, so that the
# skill's own repository doesn't treat them as its CLAUDE.md or .gitignore.
set -eu
src="$(cd "$(dirname "$0")" && pwd)/files"
cp "$src/session.md" .
mkdir -p memory
if [ -d "$src/memory" ]; then cp -R "$src/memory/." memory/; fi
mkdir -p project
cd project
git init -q -b main
git config user.name "Sam Example"
git config user.email "sam@example.com"
git config core.autocrlf false
unfixture() {
  find . -path ./.git -prune -o -name '*.fixture' -print | while read -r f; do
    mv "$f" "${f%.fixture}"
  done
}
for commit in "$src"/commits/*/; do
  if [ -f "$commit/branch.txt" ]; then
    branch="$(cat "$commit/branch.txt")"
    git switch -q "$branch" 2>/dev/null || git switch -q -c "$branch"
  fi
  cp -R "$commit/tree/." .
  unfixture
  date="$(cat "$commit/date.txt")"
  git add -A
  GIT_AUTHOR_DATE="$date" GIT_COMMITTER_DATE="$date" git commit -q -F "$commit/message.txt"
done
if [ -d "$src/wip" ]; then
  cp -R "$src/wip/." .
  unfixture
fi
