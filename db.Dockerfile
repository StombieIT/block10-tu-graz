# Используем официальный образ MongoDB как базовый
FROM mongo:latest

# Устанавливаем переменные окружения для пользователя и пароля
ENV MONGO_INITDB_ROOT_USERNAME=admin
ENV MONGO_INITDB_ROOT_PASSWORD=root123root

WORKDIR /data/db

# Открываем порт 27017 для внешнего доступа
EXPOSE 27017

# Используем стандартную команду запуска MongoDB
CMD ["mongod"]
