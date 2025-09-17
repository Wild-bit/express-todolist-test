const express = require("express");

/**
 * 请求日志中间件
 * 功能：记录每个请求的方法和路径，帮助调试
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next(); // 重要：调用 next() 继续到下一个中间件
};

/**
 * 配置应用程序的所有中间件
 * 中间件的执行顺序很重要！
 * @param {Object} app - Express 应用实例
 */
const setupMiddleware = (app) => {
  console.log("🔧 正在配置中间件...");

  // 1. 请求日志中间件 - 必须放在最前面，确保记录所有请求
  // 包括静态文件请求也会被记录
  app.use(loggerMiddleware);
  console.log("✅ 请求日志中间件已配置");

  // 2. JSON 解析中间件 - 解析请求体中的 JSON 数据
  // 这样我们就能通过 req.body 访问 POST 请求的数据
  app.use(express.json());
  console.log("✅ JSON 解析中间件已配置");

  // 3. URL 编码解析中间件 - 解析表单数据
  app.use(express.urlencoded({ extended: true }));
  console.log("✅ URL 编码解析中间件已配置");

  // 4. 静态文件服务中间件 - 提供静态文件（HTML、CSS、JS、图片等）
  // 访问 http://localhost:3000/index.html 会自动查找 public/index.html
  // 注意：静态文件中间件处理完请求后不会调用 next()，所以日志中间件必须在它之前
  app.use(express.static("public"));
  console.log("✅ 静态文件服务中间件已配置");

  console.log("🎉 所有中间件配置完成！");
};

module.exports = setupMiddleware;
