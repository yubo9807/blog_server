import { createTransport } from 'nodemailer';

/**
 * 发送邮件
 * @param mailbox 收件人邮箱号
 * @param title 标题
 * @param content 内容：innerHTML
 */
export function mailDelivery(mailbox: string, title: string, content: string) {
  let transporter = createTransport({
    // host: 'smtp.ethereal.email',
    service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
    port: 465, // SMTP 端口
    secureConnection: true, // 使用了 SSL
    auth: {
      user: '1781926993@qq.com', // 你的邮箱
      pass: 'eyjrtfozbmbzeahj',  // QQ 授权码
      // user: '1419201583@qq.com', // 你的邮箱
      // pass: 'szemogwtqnlvbaaf',  // QQ 授权码
    }
  });

  let mailOptions = {
    from: '"yubo 的博客" <1781926993@qq.com>', // sender address
    to: mailbox,  // 收件人
    subject: title,  // 标题
    html: content  // 发送text或者html格式
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    // console.log('Message sent: %s', info.messageId);
    // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
  });
}