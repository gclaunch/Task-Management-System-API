# NodeJS + Express Task Management System RESTful API

## Dependencies

- npm 9.x (latest should also work)
- node 20.x (latest should also work)

## Getting Started

Install dependencies in root directory with `npm install`. Copy the .env_example to create `.env` and type in a random key.
- `npm start` to run the app normally
- `npm run dev` (uses nodemon) if you are still developing, this will restart automatically after making changes.

Load up Postman or your favorite API platform. You can make requests for many different functions.

**Users**
- Register Users
- Delete users
- Login
- Logout
- Admin access
- List all users and their tasks

**Tasks**
- Create Task
- Update Task
- Delete Task
- List all tasks
- List all tasks for current user
- Paginate tasks
  
## Command Examples

### Users
Register User `POST http://localhost:3001/api/auth/register`
```
#body JSON
{
    "email": "email-here",
    "password": "password-here",
}
```

Register Admin `POST http://localhost:3001/api/auth/register`
```
#body JSON
{
    "email": "email-here",
    "password": "password-here",
    "isAdmin": true
}
```

Login `POST http://localhost:3001/api/auth/login`
```
#body JSON
{
    "email": "email-here",
    "password": "password-here",
}
```

### Tasks
Tasks for user `GET http://localhost:3001/api/tasks/`

Tasks Paginated `GET http://localhost:3001/api/tasks/?offset=0&limit=10`

Create Task `POST http://localhost:3001/api/tasks/create`
```
#body JSON
{
    "title": "Title Here",
    "description": "Description here",
    "due_date": "2023-09-29",
    "status": "Pending"
}
```

Update Task `PUT http://localhost:3001/api/tasks/update/task_id_here`
```
#body JSON - include only things you want to update, you can leave anything out and it will keep the original data
{
    "description": "updated description here",
    "status": "Complete"
}
```

Delete Task `DELETE http://localhost:3001/api/tasks/delete`
```
#body JSON
{
    "id": "task_id_here"
}
```