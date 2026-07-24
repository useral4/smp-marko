#!/usr/bin/env bash
set -Eeuo pipefail

exec 9>/run/lock/smp-marko-update.lock
flock -n 9 || exit 0

repo="https://github.com/useral4/smp-marko.git"
remote="$(git ls-remote "$repo" refs/heads/main | awk '{print $1}')"
test -n "$remote"

current=""
if [ -d /opt/smp-marko/current/.git ]; then
  current="$(runuser -u smpmarko -- git -C /opt/smp-marko/current rev-parse HEAD)"
fi

if [ "$remote" = "$current" ]; then
  exit 0
fi

release="/opt/smp-marko/releases/${remote:0:12}"
if [ ! -d "$release/.git" ]; then
  runuser -u smpmarko -- git clone --depth 1 --branch main "$repo" "$release"
fi

actual="$(runuser -u smpmarko -- git -C "$release" rev-parse HEAD)"
test "$actual" = "$remote"

cd "$release"
corepack pnpm install --frozen-lockfile
corepack pnpm content:sync
corepack pnpm exec next build
chown -R smpmarko:smpmarko "$release"

# If the editor saved again during the build, keep the newer live data.
# The timer will build the newest commit on its next run.
latest="$(git ls-remote "$repo" refs/heads/main | awk '{print $1}')"
if [ "$latest" != "$remote" ]; then
  exit 0
fi

ln -sfn /opt/smp-marko/shared/.env.production "$release/.env.production"
ln -sfn "$release" /opt/smp-marko/current.next
mv -Tf /opt/smp-marko/current.next /opt/smp-marko/current
systemctl restart smp-marko.service
