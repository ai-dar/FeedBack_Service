# Feedback Service API

## Описание проекта
Проект представляет серверную часть для управления отзывами (фидбеками) и голосованиями за них. Основные функции включают:
- Регистрацию и авторизацию пользователей.
- Создание, редактирование и удаление отзывов.
- Голосование за отзывы.
- Фильтрацию, сортировку и пагинацию списка отзывов.
- Предоставление списка категорий и статусов.

## Используемые технологии
- **Node.js** и **TypeScript** для серверной логики.
- **Express** для реализации REST API.
- **PostgreSQL** как база данных.
- **Prisma ORM** для работы с базой данных.

## Требования
Перед началом работы убедитесь, что на вашем компьютере установлены:
- Node.js версии 14 или выше.
- PostgreSQL с активным сервером базы данных.

## Установка и запуск
1. Склонируйте репозиторий с проектом.
    ```
    git clone <URL_ВАШЕГО_РЕПОЗИТОРИЯ>
    cd <ИМЯ_ПАПКИ_С_ПРОЕКТОМ>
2. Установите зависимости с помощью пакетного менеджера Node.js.
   ```
   npm install
3. Настройте файл `.env` с переменными окружения:
  Пример содержимого:
   
        DATABASE_URL=postgresql://username:password@localhost:5432/feedback_service?schema=public
        JWT_SECRET=your_jwt_secret
        PORT=3000

   - `DATABASE_URL`: URL для подключения к базе данных PostgreSQL.
   - `JWT_SECRET`: секретный ключ для генерации JWT-токенов.
   - `PORT`: порт для запуска сервера (по умолчанию 3000).
5. Примените миграции базы данных с помощью Prisma.
   ```
   npx prisma migrate dev
6. Запустите сервер разработки.
    ```
    npm run dev
## Запуск тестового сервера
  После запуска сервер будет доступен по адресу: `http://localhost:3000`
## Функциональность : Документация API
### Для теста использовался Postman. 
### Headers
    ```
    Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzM0NzIyOTU1LCJleHAiOjE3MzUzMjc3NTV9.UP_Je_ePOPcw2wJP631ukFkFqCTUP_cdFsPw8F2mMb4
    ```
    Content-Type application/json
 

### Auth
- **POST /auth/register**: Регистрация пользователя.
  - Тело запроса:
    ```json
    {
      "email": "test@example.com",
      "password": "123456",
      "avatar": "avatar.png"
    }
    ```
  - Ответ:
    ```json
    {
      "token": "<JWT_TOKEN>",
      "user": {
        "id": 1,
        "email": "test@example.com",
        "avatar": "avatar.png"
      }
    }
    ```

- **POST /auth/login**: Авторизация пользователя.
  - Тело запроса:
    ```json
    {
      "email": "test@example.com",
      "password": "123456"
    }
    ```
  - Ответ:
    ```json
    {
      "token": "<JWT_TOKEN>",
      "user": {
        "id": 1,
        "email": "test@example.com",
        "avatar": "avatar.png"
      }
    }
    ```

### User
- **GET /users/me**: Получение информации о текущем пользователе.
  - Заголовок:
    ```
    Authorization: Bearer <JWT_TOKEN>
    ```
  - Ответ:
    ```json
    {
      "id": 1,
      "email": "test@example.com",
      "avatar": "avatar.png"
    }
    ```

### Feedbacks
- **POST /feedbacks**: Создание отзыва.
  - Заголовок:
    ```
    Authorization: Bearer <JWT_TOKEN>
    ```
  - Тело запроса:
    ```json
    {
      "title": "New Feature",
      "description": "Add dark mode.",
      "category": "UI",
      "status": "IDEA"
    }
    ```
  - Ответ:
    ```json
    {
      "id": 1,
      "title": "New Feature",
      "description": "Add dark mode.",
      "category": "UI",
      "status": "IDEA",
      "authorId": 1,
      "createdAt": "2024-12-21T12:00:00.000Z",
      "updatedAt": "2024-12-21T12:00:00.000Z"
    }
    ```

- **PUT /feedbacks/:id**: Обновление отзыва.
  - Заголовок:
    ```
    Authorization: Bearer <JWT_TOKEN>
    ```
  - Тело запроса:
    ```json
    {
      "title": "Updated Feature",
      "description": "Updated description.",
      "status": "IN_PROGRESS"
    }
    ```
  - Ответ:
    ```json
    {
      "id": 1,
      "title": "Updated Feature",
      "description": "Updated description.",
      "category": "UI",
      "status": "IN_PROGRESS",
      "authorId": 1,
      "createdAt": "2024-12-21T12:00:00.000Z",
      "updatedAt": "2024-12-21T14:00:00.000Z"
    }
    ```

- **DELETE /feedbacks/:id**: Удаление отзыва.
  - Заголовок:
    ```
    Authorization: Bearer <JWT_TOKEN>
    ```
  - Ответ:
    ```json
    {
      "message": "Feedback deleted successfully."
    }
    ```

- **GET /feedbacks/:id**: Получение конкретного отзыва.
  - Ответ:
    ```json
    {
      "id": 1,
      "title": "New Feature",
      "description": "Add dark mode.",
      "category": "UI",
      "status": "IDEA",
      "authorId": 1,
      "votes": [],
      "createdAt": "2024-12-21T12:00:00.000Z",
      "updatedAt": "2024-12-21T12:00:00.000Z"
    }
    ```

- **GET /feedbacks**: Получение списка отзывов.
  - Параметры:
    - `category`: фильтр по категории.
    - `status`: фильтр по статусу.
    - `sortBy`: поле для сортировки (`createdAt`, `votesCount`).
    - `order`: порядок сортировки (`asc` или `desc`).
    - `page`: номер страницы.
    - `perPage`: количество записей на странице.
  - Ответ:
    ```json
    {
      "data": [
        {
          "id": 1,
          "title": "New Feature",
          "description": "Add dark mode.",
          "category": "UI",
          "status": "IDEA",
          "votesCount": 5
        }
      ],
      "pagination": {
        "total": 10,
        "page": 1,
        "perPage": 10,
        "totalPages": 1
      }
    }
    ```

### Votes
- **POST /votes/:feedbackId**: Добавление голоса за отзыв.
  - Заголовок:
    ```
    Authorization: Bearer <JWT_TOKEN>
    ```
  - Ответ:
    ```json
    {
      "message": "Vote successfully registered."
    }
    ```

### References
- **GET /references/categories**: Получение списка категорий.
  - Ответ:
    ```json
    {
      "categories": ["FUNCTIONALITY", "BUG", "UI", "PERFORMANCE"]
    }
    ```

- **GET /references/statuses**: Получение списка статусов.
  - Ответ:
    ```json
    {
      "statuses": ["IDEA", "PLANNED", "IN_PROGRESS", "COMPLETED"]
    }
    ```

## Лицензия
Проект разработан в рамках тестового задания.
