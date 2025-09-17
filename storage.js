/**
 * 内存存储模块 - TodoList 数据管理
 *
 * 这个模块演示了如何创建一个简单的数据存储层
 * 在真实项目中，这里会连接数据库（如 MySQL、MongoDB 等）
 * 但为了学习，我们使用内存存储，重启后数据会丢失
 */

// 内存中的数据存储 - 使用数组存储所有 todo 项目
let todos = [];

// ID 计数器 - 用于生成唯一的 todo ID
let nextId = 1;

/**
 * Todo 数据模型结构：
 * {
 *   id: Number,        // 唯一标识符
 *   title: String,     // 任务标题
 *   completed: Boolean, // 完成状态
 *   createdAt: Date    // 创建时间
 * }
 */

/**
 * 获取所有 Todo 项目
 * @returns {Array} 所有 todo 项目的数组
 */
function getAllTodos() {
  console.log(`📖 获取所有 todos，当前共有 ${todos.length} 个项目`);
  return [...todos]; // 返回副本，避免外部直接修改原数组
}

/**
 * 根据 ID 获取特定的 Todo 项目
 * @param {Number} id - Todo 项目的 ID
 * @returns {Object|null} 找到的 todo 项目，如果不存在则返回 null
 */
function getTodoById(id) {
  const todo = todos.find((todo) => todo.id === parseInt(id));
  console.log(`🔍 查找 ID 为 ${id} 的 todo:`, todo ? "找到了" : "未找到");
  return todo || null;
}

/**
 * 创建新的 Todo 项目
 * @param {Object} todoData - 包含 title 的对象
 * @param {String} todoData.title - 任务标题
 * @returns {Object} 创建的 todo 项目
 * @throws {Error} 如果数据验证失败
 */
function createTodo(todoData) {
  // 数据验证
  if (
    !todoData ||
    typeof todoData.title !== "string" ||
    todoData.title.trim() === ""
  ) {
    throw new Error("Todo 标题不能为空");
  }

  // 创建新的 todo 对象
  const newTodo = {
    id: nextId++, // 分配新的 ID 并递增计数器
    title: todoData.title.trim(), // 去除首尾空格
    completed: false, // 新创建的任务默认未完成
    createdAt: new Date(), // 记录创建时间
  };

  // 添加到存储数组
  todos.push(newTodo);

  console.log(`✅ 创建新 todo: ID=${newTodo.id}, 标题="${newTodo.title}"`);
  return newTodo;
}

/**
 * 更新现有的 Todo 项目
 * @param {Number} id - 要更新的 todo ID
 * @param {Object} updateData - 要更新的数据
 * @param {String} [updateData.title] - 新的标题（可选）
 * @param {Boolean} [updateData.completed] - 新的完成状态（可选）
 * @returns {Object|null} 更新后的 todo 项目，如果不存在则返回 null
 * @throws {Error} 如果数据验证失败
 */
function updateTodo(id, updateData) {
  const todoIndex = todos.findIndex((todo) => todo.id === parseInt(id));

  if (todoIndex === -1) {
    console.log(`❌ 更新失败：找不到 ID 为 ${id} 的 todo`);
    return null;
  }

  // 数据验证
  if (updateData.title !== undefined) {
    if (
      typeof updateData.title !== "string" ||
      updateData.title.trim() === ""
    ) {
      throw new Error("Todo 标题不能为空");
    }
  }

  // 更新数据
  const todo = todos[todoIndex];
  if (updateData.title !== undefined) {
    todo.title = updateData.title.trim();
  }
  if (updateData.completed !== undefined) {
    todo.completed = Boolean(updateData.completed);
  }

  console.log(`🔄 更新 todo: ID=${id}, 新数据:`, updateData);
  return todo;
}

/**
 * 删除 Todo 项目
 * @param {Number} id - 要删除的 todo ID
 * @returns {Boolean} 删除成功返回 true，如果项目不存在返回 false
 */
function deleteTodo(id) {
  const todoIndex = todos.findIndex((todo) => todo.id === parseInt(id));

  if (todoIndex === -1) {
    console.log(`❌ 删除失败：找不到 ID 为 ${id} 的 todo`);
    return false;
  }

  const deletedTodo = todos.splice(todoIndex, 1)[0];
  console.log(`🗑️ 删除 todo: ID=${id}, 标题="${deletedTodo.title}"`);
  return true;
}

/**
 * 获取存储统计信息
 * @returns {Object} 包含统计信息的对象
 */
function getStats() {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const pending = total - completed;

  const stats = {
    total,
    completed,
    pending,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };

  console.log(
    `📊 存储统计: 总计=${total}, 已完成=${completed}, 待完成=${pending}`
  );
  return stats;
}

/**
 * 清空所有 Todo 项目（用于测试或重置）
 */
function clearAllTodos() {
  const count = todos.length;
  todos = [];
  nextId = 1;
  console.log(`🧹 清空所有 todos，共删除 ${count} 个项目`);
}

// 导出所有函数，供其他模块使用
module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getStats,
  clearAllTodos,
};

// 初始化一些示例数据（仅用于开发测试）
if (process.env.NODE_ENV !== "production") {
  console.log("🌱 初始化示例数据...");
  createTodo({ title: "学习 Express 中间件" });
  createTodo({ title: "实现 RESTful API" });
  createTodo({ title: "创建前端界面" });

  // 标记第一个任务为已完成
  updateTodo(1, { completed: true });

  console.log("✅ 示例数据初始化完成");
}
