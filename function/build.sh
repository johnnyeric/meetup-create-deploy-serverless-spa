GCR_PROJECT_ID=<your-grc-project>

docker build -t meetup-serverless-function .
docker tag meetup-serverless-function:latest gcr.io/$GCR_PROJECT_ID/meetup-serverless-function
docker push gcr.io/$GCR_PROJECT_ID/meetup-serverless-function