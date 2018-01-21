import './assets/css/main.css';
import io from './assets/js/socket.io'

let oEnter = document.getElementById('js-enter')
let oCount = document.getElementById('js-conut')
let oCount2 = document.getElementById('js-conut2')
let oLogin = document.getElementById('js-login')
let oLoginBtn = document.getElementById('js-loginBtn')
let oOpenBton = document.getElementById('js-openBtn')
let oBg = document.getElementById('js-bg')
let oChatBox = document.getElementById('js-chatBox')
// let socket = io('ws://47.91.235.153:3000')
let socket = io('ws://localhost:3000')
let oMessageBox = document.getElementById('js-messageBox')
let oUserBox = document.getElementById('js-userList')
let loginStatus = false
let nickName = ''

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
    <div class="message">${data.text}</div>
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
    <div class="name">${data.name}</div>
    <div class="message">${data.text}</div>
  </li>`
  oMessageBox.scrollTop = oMessageBox.scrollHeight
})

// 发送消息
oEnter.addEventListener('click', function () {
  let oText = document.getElementById('js-text')
  let sText = oText.value
  if (sText === '') {
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
})

// 登录
oLoginBtn.addEventListener('click', function () {
  let loginName = document.getElementById('js-loginName').value
  if (loginName === '') {
    alert('你必须输入用户名')
  } else {
    nickName = loginName
    // 登录
    socket.emit('login', {
      name: nickName
    })
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
