FROM golang:1.23.4-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .

RUN go build -o xhain-calendar-backend cmd/backend/main.go

FROM alpine:3.21.0

COPY --from=builder /app/xhain-calendar-backend /app/xhain-calendar-backend

EXPOSE 8080

CMD ["/app/xhain-calendar-backend"]
