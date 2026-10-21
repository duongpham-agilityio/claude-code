#!/usr/bin/env bash
# Read-only pre-flight for push-pr. Usage: preflight.sh [auto|manual] [base-branch] [remote=<name>]
# Prints key=value facts, a VERDICT, and a NEXT block holding only the steps that apply
# to this mode and verdict. Never pushes or creates anything.
mode=manual; base=""; want=""
for a in "$@"; do
  case "$a" in auto|manual) mode=$a ;; remote=*) want=${a#remote=} ;; *) base=$a ;; esac
done

branch=$(git branch --show-current 2>/dev/null)
dirty=$(git status --short --untracked-files=no 2>/dev/null | wc -l | tr -d ' ')
remotes=$(git remote 2>/dev/null | tr '\n' ' ' | sed 's/ $//')
set -- $remotes
remote=""; how=""

# Remote: explicit arg > only remote > branch upstream > remote.pushDefault > ask
if [ -n "$want" ]; then
  if git remote | grep -qx "$want"; then remote=$want; how=arg; fi
elif [ "$#" -eq 1 ]; then remote=$1; how=only
elif [ "$#" -gt 1 ]; then
  up=$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null | cut -d/ -f1)
  pd=$(git config --get remote.pushDefault)
  if [ -n "$up" ] && git remote | grep -qx "$up"; then remote=$up; how=upstream
  elif [ -n "$pd" ] && git remote | grep -qx "$pd"; then remote=$pd; how=pushDefault; fi
fi

host=unknown; cli=""
if [ -n "$remote" ]; then
  url=$(git remote get-url "$remote")
  case "$url" in *github.com*) host=github; cli=gh ;; *gitlab*) host=gitlab; cli=glab ;; esac
fi
auth=n/a; pr=none
if [ -n "$cli" ]; then
  if ! command -v "$cli" >/dev/null 2>&1; then auth="$cli not installed"
  elif "$cli" auth status >/dev/null 2>&1; then
    auth=ok
    if [ "$cli" = gh ]; then pr=$(gh pr view --json url -q .url 2>/dev/null || echo none)
    else pr=$(glab mr view 2>/dev/null | sed -n 's/^url:[[:space:]]*//p' | head -1); pr=${pr:-none}; fi
  else auth=not-logged-in; fi
fi
if [ -z "$base" ] && [ -n "$remote" ]; then
  base=$(git symbolic-ref --short "refs/remotes/$remote/HEAD" 2>/dev/null | sed "s#^$remote/##")
  [ -z "$base" ] && for b in main master; do git rev-parse -q --verify "refs/remotes/$remote/$b" >/dev/null && base=$b && break; done
fi
ahead=n/a
[ -n "$remote" ] && [ -n "$base" ] && ahead=$(git rev-list --count "$remote/$base..HEAD" 2>/dev/null || echo 0)

v=READY; hint=""
if [ -z "$branch" ]; then v="STOP: detached HEAD"; hint="Check out or create a branch first."
elif [[ "$branch" =~ ^(main|master)$ ]]; then v="STOP: on protected branch $branch"; hint="Never push $branch. Offer to create a feature branch (type/short-kebab-description)."
elif [ "$dirty" -gt 0 ]; then v="STOP: working tree dirty ($dirty files)"; hint="Ask the user: commit first, or leave the changes out."
elif [ -z "$remotes" ]; then v="STOP: no remote"
  hint="Tell the user to run one of these themselves (do not run them): git remote add origin <url> | gh repo create --source . --remote origin"
elif [ -n "$want" ] && [ -z "$remote" ]; then v="STOP: remote '$want' not found, available: $remotes"; hint="Ask which remote to use."
elif [ -z "$remote" ]; then v="STOP: several remotes ($remotes), no upstream or pushDefault"; hint="Ask which remote for this run, then re-run with remote=<name>. Tell the user they can stop being asked by running once: git config remote.pushDefault <name>"
elif [ "$host" = unknown ]; then v="STOP: unknown host for remote $remote"; hint="Only GitHub (gh) and GitLab (glab) are supported."
elif [ "$auth" != ok ]; then v="STOP: CLI problem ($auth)"; hint="Tell the user to install or log in themselves (gh auth login / glab auth login). Never handle credentials."
elif [ -z "$base" ]; then v="STOP: cannot detect base branch"; hint="Ask the user for the base branch, then pass it as an argument."
elif [ "$ahead" = 0 ]; then v="STOP: no commits ahead of $remote/$base"; hint="Nothing to open a PR for."
elif [ "$pr" != none ]; then v="EXISTING_PR"; hint="Report $pr. Create no second PR. Push new commits only if the user asked."
fi

echo "MODE=$mode"; echo "BRANCH=${branch:-DETACHED}"; echo "REMOTE=${remote:-none} ($how)"
echo "HOST=$host"; echo "BASE=${base:-n/a}"; echo "COMMITS_AHEAD=$ahead"; echo "EXISTING_PR=$pr"
echo "VERDICT=$v"
echo "NEXT:"
case "$v" in
  READY)
    if [ "$mode" = auto ]; then
      echo "1. git push -u $remote $branch (never force; if rejected, report and ask)."
      echo "2. Draft title and body from: git log $remote/$base..HEAD and git diff $remote/$base...HEAD --stat"
      echo "3. Create the PR immediately, then report."
    else
      echo "1. Draft title and body from: git log $remote/$base..HEAD and git diff $remote/$base...HEAD --stat"
      echo "2. Show the draft and the exact command: git push -u $remote $branch. STOP. Do not push yet."
      echo "3. After an explicit yes: push (never force; if rejected, report and ask), then create the PR. Apply requested edits and show again first."
    fi ;;
  *) echo "$hint" ;;
esac
