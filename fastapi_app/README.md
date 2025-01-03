起動コマンド
`uvicorn main:app --host 0.0.0.0 --port 8080`

Dockerにて起動
`docker run -p 8080:8080 fastapi-app-test`

## デプロイまでの手順

Dockerイメージのビルド
`docker build -t gcr.io/scenic-outcome-435508-d9/fastapi-app .`

コンテナをGoogle Containre Resistryにプッシュ
```
docker tag fastapi-app-test gcr.io/scenic-outcome-435508-d9/fastapi-app
docker push gcr.io/scenic-outcome-435508-d9/fastapi-app
```

Cloud Runにデプロイ
```
gcloud run deploy fastapi-app \
    --image gcr.io/scenic-outcome-435508-d9/fastapi-app \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --timeout=600s \
    --memory=1Gi
```