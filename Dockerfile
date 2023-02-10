from node:alpine as builder

add . .
run npm install && npm run build

from node:alpine

copy --from=builder build ./build

add package.json .
expose 3000
cmd ["node", "build"]