/**
 * Express TodoList Demo - 主应用文件
 *
 * 这是应用的入口文件，负责：
 * 1. 创建 Express 应用实例
 * 2. 配置中间件
 * 3. 设置路由
 * 4. 启动服务器
 */

const express = require("express");
const setupMiddleware = require("./middleware");
const storage = require("./storage");

// 创建 Express 应用实例
const app = express();
const port = process.env.PORT || 3000;

console.log("🚀 启动 Express TodoList Demo...");

// 配置所有中间件
setupMiddleware(app);

/**
 * 基础路由 - 重定向到静态页面
 * 当用户访问根路径时，重定向到我们的 HTML 页面
 */
app.get("/", (req, res) => {
  res.redirect("/index.html");
});

/**
 * API 健康检查路由
 * 用于检查服务器是否正常运行
 */
app.get("/api/health", (req, res) => {
  const stats = storage.getStats();
  res.json({
    status: "ok",
    message: "TodoList API 运行正常",
    timestamp: new Date().toISOString(),
    stats: stats,
  });
});

/**
 * 获取所有 todos 的简单路由（临时测试用）
 * 在下个阶段我们会把这些移到专门的路由文件中
 */
app.get("/api/todos", (req, res) => {
  try {
    const todos = storage.getAllTodos();
    res.json({
      success: true,
      data: todos,
      count: todos.length,
    });
  } catch (error) {
    console.error("获取 todos 失败:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
});

/**
 * 404 错误处理 - 处理未找到的路由
 * 这个中间件会捕获所有未匹配的路由
 */
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `路由 ${req.originalUrl} 不存在`,
    availableRoutes: ["GET /", "GET /api/health", "GET /api/todos"],
  });
});

/**
 * 全局错误处理中间件
 * Express 的错误处理中间件必须有 4 个参数
 */
app.use((err, req, res, next) => {
  console.error("💥 全局错误:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "服务器内部错误",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

/**
 * 启动服务器
 */
app.listen(port, () => {
  console.log(`📍 本地访问地址: http://localhost:${port}`);
  console.log(`\n💡 提示: 按 Ctrl+C 停止服务器`);
});

/**
 * 优雅关闭处理
 * 当收到终止信号时，优雅地关闭服务器
 */
process.on("SIGTERM", () => {
  console.log("\n🛑 收到 SIGTERM 信号，正在优雅关闭服务器...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\n🛑 收到 SIGINT 信号，正在优雅关闭服务器...");
  process.exit(0);
});
