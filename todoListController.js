const storage = require("./storage");
class TodoListController {
  /**
   * 初始化数据
   */
  static initTodo() {
    console.log("🌱 初始化示例数据...");
    storage.createTodo({ title: "学习 Express 中间件" });
    storage.createTodo({ title: "实现 RESTful API" });
    storage.createTodo({ title: "创建前端界面" });

    // 标记第一个任务为已完成
    storage.updateTodo(1, { completed: true });

    console.log("✅ 示例数据初始化完成");
  }

  /**
   * 获取所有 Todo 项目
   * GET /api/todos
   * @param {Object} req - Express 请求对象
   * @param {Object} res - Express 响应对象
   */
  static getAllTodos(req, res) {
    const todos = storage.getAllTodos();
    try {
      res.json({
        code: 0,
        data: {
          todos,
          count: todos.length,
        },
        message: "success",
      });
    } catch (error) {
      console.error("❌ 获取 todos 失败:", error);
      res.status(500).json({
        code: -1,
        message: "获取 todos 失败",
        error: error.message,
      });
    }
  }

  /**
   * 获取单个 Todo 项目
   * GET /api/todo/:id
   * @param {string} id - Todo 项目的 ID
   * @param {Object} req - Express 请求对象
   * @param {Object} res - Express 响应对象
   */
  static getTodoListById(req, res) {
    const { id } = req.params;
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      return res.status(400).json({
        code: -1,
        message: `todo id:${id} is not a number`,
      });
    }
    const todo = storage.getTodoById(idNumber);
    if (todo) {
      res.json({
        code: 0,
        data: todo,
        message: "success",
      });
    } else {
      res.status(404).json({
        code: -1,
        message: `todo id:${id} not found`,
      });
    }
  }

  /**
   * 创建新的 Todo 项目
   * POST /api/create
   * @param {Object} req - Express 请求对象
   * @param {Object} res - Express 响应对象
   */
  static createTodo(req, res) {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({
        code: -1,
        message: "todo title is required",
      });
    }
    const todo = storage.createTodo({ title });
    res.status(201).json({
      code: 0,
      data: todo,
      message: "todo created",
    });
  }

  /**
   * 更新 Todo 项目
   * PUT /api/todo/:id
   * @param {string} id - Todo 项目的 ID
   * @param {Object} req - Express 请求对象
   * @param {Object} res - Express 响应对象
   */
  static updateTodo(req, res) {
    const { id } = req.params;
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      return res.status(400).json({
        code: -1,
        message: `todo id:${id} is not a number`,
      });
    }
    const { title, completed } = req.body;
    const updatedTodo = storage.updateTodo(idNumber, {
      title,
      completed,
    });
    if (updatedTodo) {
      res.json({
        code: 0,
        data: updatedTodo,
        message: "todo updated",
      });
    } else {
      res.status(404).json({
        code: -1,
        message: `todo id:${id} not found`,
      });
    }
  }

  /**
   * 删除 Todo 项目
   * DELETE /api/todo/:id
   * @param {string} id - Todo 项目的 ID
   * @param {Object} req - Express 请求对象
   * @param {Object} res - Express 响应对象
   */
  static deleteTodo(req, res) {
    const { id } = req.params;
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      return res.status(400).json({
        code: -1,
        message: `todo id:${id} is not a number`,
      });
    }
    const deleted = storage.deleteTodo(idNumber);
    if (deleted) {
      res.json({
        code: 0,
        message: "todo deleted",
      });
    } else {
      res.status(404).json({
        code: -1,
        message: `todo id:${id} not found`,
      });
    }
  }
}

module.exports = TodoListController;
