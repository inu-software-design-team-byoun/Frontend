### 처음 클론받을 때 터미널 명령어 입력 순서

한번에 하기

```bash
git clone https://github.com/inu-software-design-team-byoun/Frontend.git && cd Frontend && git checkout develop && yarn install
```

따로따로 하기

- `git clone https://github.com/inu-software-design-team-byoun/Frontend.git`
- `cd Frontend`
- `git checkout develop`
- `yarn install`

실행

- `yarn dev`

### 이미 클론받았는데 최신화하려는 경우

한번에 하기

```bash
cd Frontend && git checkout develop && git pull && yarn install
```

따로따로 하기

- `cd Frontend`
- `git checkout develop`
- `git pull`
- `yarn install`

실행

- `yarn dev`
