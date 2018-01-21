var app = require('http').createServer()
var io = require('socket.io')(app)

var users = []

io.on('connection', function (socket) {
  socket.nickName = '未知用户'
  // 登录
  socket.on('login', function (data) {
    if (users.indexOf(data.name) >= 0) {
      console.log(data.name + ' 已有重名用户，请重新输入昵称。')
      socket.emit('login', {
        status: 'err',
        text: '已有重名用户，请重新输入昵称。'
      })
    } else {
      // 添加一个用户
      users.push(data.name)
      // 设置当前用户的 nickName
      socket.nickName = data.name
      console.log(data.name + ' 进入了房间')
      console.log('当前用户', users)
      // 发送进入房间的通知
      io.emit('sys', {
        text: socket.nickName + ' 进入了房间',
        count: users.length,
        users: users
      })
      // 发送登录成功的通知
      socket.emit('login', {
        status: 'ok'
      })
    }
  })

  // 接收发送信息后广播给除自己外的所有人
  socket.on('message', function (data) {
    socket.broadcast.emit('message', data)
  })
  
  // 断开连接
  socket.on('disconnect', function () {
    let index = users.indexOf(socket.nickName)
    if (index >= 0) users.splice(index, 1)
    // 离开房间发送通知
    io.emit('sys', {
      text: socket.nickName + ' 离开了房间',
      count: users.length,
      users, users
    })
    console.log(socket.nickName + '离开了房间')
    console.log('当前用户', users)
  })
})

app.listen(3000, function () {
  console.log('WebSocket 启用端口 on *: 3000')
})