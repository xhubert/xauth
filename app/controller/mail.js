/**
 * @desc MailController
 */

const { Controller } = require('egg')
const nodemailer = require('nodemailer')

module.exports = class MailController extends Controller {
  /**
   * @description 验证邮件服务器
   */
  async verify() {
    const { app, ctx } = this
    const transporter = nodemailer.createTransport({ ...app.config.mailer })
    try {
      const info = await transporter.sendMail({
        from: `"NoReply@BigSeller 👻" ${process.env.MAILER_NO_REPLY}`,
        to: app.config.pkg.email,
        subject: '你正在重置密码',
        text: `你重置密码的验证码为，12小时后失效。`,
        html: `<div>你重置密码的验证码为：</div><h2>TEST</h2><div>12小时后失效。</div>`
      })
      console.log('Message sent: %s', info.messageId)
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
      ctx.success('test', '用户详情获取成功')
    } catch (e) {
      this.logger.error(e)
      ctx.fail('验证码邮件发送失败')
    }
  }
}
