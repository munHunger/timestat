#!/bin/bash
kubectl delete secret ghcr-login-secret
kubectl create secret docker-registry ghcr-login-secret --docker-server=https://ghcr.io --docker-username=munhunger --docker-password=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 --docker-email=marcus.munger@gmail.com