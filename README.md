EmailNotification
=================

邮件通知同事进行AP值班。

使用方法：

在linux环境下运行

sh start.sh

--------------------------------------

文件结构说明：

start.sh 用于在linux环境下启动服务。启动服务后，会添加一个名为ApEmailer的进程。

config.json用于配置发送邮件。


"username":发邮件的用户名
"password":发邮件的密码
"smtp":发邮件的smtp服务地址
"crontab" : 用于设置发送时间，默认为每个小时的0分
"hours":数组，用于设置
"port":smtp的ssl端口
"emailtitle":发送邮件的标题
"emailcontent":发送邮件的内容
"emails":用来配置同事的名字与邮箱对应关系
"dates":用来配置哪一天是谁值班

main.js是程序的主文件，是程序的入口

package.json配置了程序所以来的nodejs包

password.cfg记录了发送邮件的邮箱用户名和密码

schema.js是用来对config.json进行验证的文件，使用了amanda进行json校验

