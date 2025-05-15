#! /bin/bash
protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto \
--ts_proto_out=./libs/repo/src/grpc \
--ts_proto_opt=nestJs=true,addGrpcMetadata=true \
./proto/$1.proto
