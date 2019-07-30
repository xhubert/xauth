exports.enum = {
  user: {
    // 角色 0 管理员 | 1 普通用户
    role: {
      default: 1,
      optional: {
        ADMIN: 0,
        NORMAL: 1
      }
    }
  }
}
