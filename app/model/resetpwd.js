/**
 * @desc 重置密码模型
 */

module.exports = app => {
  const { mongoose } = app
  const { Schema } = mongoose

  const ResetpwdSchema = new Schema({
    userid: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    code: { type: String, required: true }
  })

  return mongoose.model('Resetpwd', app.processSchema(ResetpwdSchema))
}

