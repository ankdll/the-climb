#!/bin/sh
# Publishes The Climb to the public GitHub repository, without this project's
# private history.
#
# The public repository has its own history, kept on the local branch "public":
# each run adds one commit holding main's current files, minus everything listed
# in .publicignore, signed with your GitHub name and GitHub's no-reply email.
# Your own history on main is never changed or sent.
#
#   scripts/publish-public.sh "What changed"         publish
#   scripts/publish-public.sh --dry-run "What"       show what would go, send nothing
set -eu
cd "$(git rev-parse --show-toplevel)"

DRY=0
if [ "${1:-}" = "--dry-run" ]; then DRY=1; shift; fi
MESSAGE="${1:-Update The Climb}"
NAME="ankdll"
EMAIL="353153929+ankdll@users.noreply.github.com"
REMOTE="https://github.com/ankdll/the-climb.git"

if [ -n "$(git status --porcelain)" ]; then
  echo "Commit or discard your changes first, so what's published matches main." >&2
  exit 1
fi

# Build the public files in a scratch index, leaving your own untouched.
INDEX=$(mktemp)
trap 'rm -f "$INDEX"' EXIT
export GIT_INDEX_FILE="$INDEX"
git read-tree main
grep -v '^#' .publicignore | grep -v '^[[:space:]]*$' | while read -r path; do
  git rm -r --cached --quiet --ignore-unmatch -- "$path"
done
TREE=$(git write-tree)
unset GIT_INDEX_FILE

PARENT=$(git rev-parse -q --verify refs/heads/public || true)
if [ -n "$PARENT" ] && [ "$(git rev-parse "$PARENT^{tree}")" = "$TREE" ]; then
  echo "Nothing new to publish."
  exit 0
fi

if [ "$DRY" = 1 ]; then
  echo "Files that would be public:"
  git ls-tree -r --name-only "$TREE"
  exit 0
fi

COMMIT=$(printf '%s\n' "$MESSAGE" | \
  GIT_AUTHOR_NAME="$NAME" GIT_AUTHOR_EMAIL="$EMAIL" \
  GIT_COMMITTER_NAME="$NAME" GIT_COMMITTER_EMAIL="$EMAIL" \
  git commit-tree "$TREE" ${PARENT:+-p "$PARENT"})
git update-ref refs/heads/public "$COMMIT"
git push "$REMOTE" public:main
echo "Published. The site updates in a minute or two."
