import './assets/css/main.css';
import io from './assets/js/socket.io'

let oEnter = document.getElementById('js-enter')              // 发送消息按钮
let oCount = document.getElementById('js-conut')              // 在线人数
let oCount2 = document.getElementById('js-conut2')            // 在线人数
let oLogin = document.getElementById('js-login')              // 登录弹窗
let oLoginBtn = document.getElementById('js-loginBtn')        // 登录按钮
let oOpenBton = document.getElementById('js-openBtn')         // 打开用户列表的按钮
let oBg = document.getElementById('js-bg')                    // 遮罩
let oChatBox = document.getElementById('js-chatBox')          // 聊天窗口
let socket = io('ws://chatapi.rxshc.com')                 // ws 链接
// let socket = io('ws://localhost:3000')                        // ws 链接
let oMessageBox = document.getElementById('js-messageBox')    // 消息窗口
let oUserBox = document.getElementById('js-userList')         // 用户列表
let loginStatus = false                                       // 登录状态
let nickName = ''                                             // 当前登录用户名

// 清除HTML标签
function delHtmlTag (str) {
  return str.replace(/<[^>]+>/g,"");
}

// 连接服务器
socket.on('connect', function () {
  console.log('成功连接服务器')
})

// 登录状态
socket.on('login', function (data) {
  if (data.status === 'ok') {
    loginStatus = true
    oLogin.style.visibility = 'hidden'
  } else {
    alert(data.text)
  }
})

// 系统通知
socket.on('sys', function (data) {
  oCount.innerHTML = oCount2.innerHTML = data.count
  oMessageBox.innerHTML += `<li class="sys">
    <div class="name">系统通知</div>
    <div class="message">${delHtmlTag(data.text)}</div>
  </li>`

  let sUser = ''
  data.users.forEach(el => {
    sUser += `<li>${el}</li>`
  });
  oUserBox.innerHTML = sUser
})

// 消息
socket.on('message', function (data) {
  oMessageBox.innerHTML += `<li>
    <div class="name">${delHtmlTag(data.name)}</div>
    <div class="message">${delHtmlTag(data.text)}</div>
  </li>`
  oMessageBox.scrollTop = oMessageBox.scrollHeight
})

// 发送消息
function sendMessage () {
  let oText = document.getElementById('js-text')
  let sText = delHtmlTag(oText.value)
  if (sText === '') {
    alert('不能为空')
    return false
  } else if (sText.length > 30) {
    alert('内容不能超过30个字')
    return false
  }
  socket.emit('message', {
    name: nickName,
    text: sText
  })
  oMessageBox.innerHTML += `<li class="my">
    <div class="name">${nickName}</div>
    <div class="message">${sText}</div>
  </li>`
  oText.value = ''
  oMessageBox.scrollTop = oMessageBox.scrollHeight
}
oEnter.addEventListener('click', sendMessage)
document.getElementById('js-text').addEventListener('keydown', function () {
  if (event.key === 'Enter') {
    sendMessage()
  }
})

// 登录
function userLogin () {
  let loginName = delHtmlTag(document.getElementById('js-loginName').value)
  if (loginName === '') {
    alert('你必须输入用户名')
  } else if (loginName.length > 10) {
    alert('用户名不能超过十个字符')
  } else {
    nickName = loginName
    // 登录
    socket.emit('login', {
      name: nickName
    })
  }
}
oLoginBtn.addEventListener('click', userLogin)
document.getElementById('js-loginName').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    userLogin()
  }
})

// 打开用户列表
oOpenBton.addEventListener('click', function () {
  oChatBox.classList.toggle('open')
})
// 关闭用户列表
oBg.addEventListener('click', function () {
  oChatBox.classList.remove('open')
})
