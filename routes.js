const TodoListController = require("./todoListController");

const express = require("express");

/**
 * 路由配置
 * @param {Object} app - Express 应用实例
 */
module.exports = (app) => {
  app.get("/", (req, res) => {
    res.redirect("/index.html");
  });
  TodoListController.initTodo();
  const todoListRouter = express.Router();
  todoListRouter.get("/todos", TodoListController.getAllTodos);
  todoListRouter.get("/todo/:id", TodoListController.getTodoListById);
  todoListRouter.post("/todo/create", TodoListController.createTodo);
  todoListRouter.put("/todo/update/:id", TodoListController.updateTodo);
  todoListRouter.delete("/todo/delete/:id", TodoListController.deleteTodo);
  app.use("/api", todoListRouter);
};
