docker build -t meetup-serverless-function .
docker tag meetup-serverless-function:latest gcr.io/johnnyeric/meetup-serverless-function
docker push gcr.io/johnnyeric/meetup-serverless-function