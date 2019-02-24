# webhook-public

## How to start
>`npm start`

## How to create a shell script

```
#!/bin/bash

REPOSITORY="<target-directory>"
echo $1 >> logs/<website-name>-$1.txt
cd $REPOSITORY && VER=$1 npm run www:webhook
```

### Detail
> `<target-directory>`: webroot directory
>
> `$1`: tag name
>
> `npm run www:webhook`: git checkout -b $1 && npm run build



# Example

## Setting for target-project

Uses the [gh-release](https://github.com/hypermodules/gh-release) to create a new GitHub release.

`package.json`
```
  ...

  "scripts": {
    "release": "node_modules/.bin/gh-release -t $VER -n $VER -c master -b init"
  },
  "dependencies": {
    "gh-release": "^3.4.0"
  }
  ...
```

## Usage
git push command and run a command `VER=<tag> npm run release`

```
$ VER=1.0.0 npm run release
```
