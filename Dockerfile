# Node.js 20 이상 버전 사용
FROM node:20.11.1-alpine

WORKDIR /app

# 의존성 설치
COPY package.json yarn.lock ./
RUN yarn install

COPY . .

# 개발 서버와 빌드를 위한 포트 노출
EXPOSE 5173

# 개발용 명령어로 서버 실행
CMD ["yarn", "dev", "--host"]
