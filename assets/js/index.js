$(function () {
  getUserInfo()
  const layer = layui.layer
  $('.back').on('click', function () {
    //提示用户是否确认退出
    layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
      //do something
      // 清空本地存储
      localStorage.removeItem('token')
      // 跳转页面
      location.href = '/login.html'
      // 关闭询问框
      layer.close(index);
    });
  })
})
// 获取用户基本信息
const url = 'http://www.liulongbin.top:3007'
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: url + '/my/userinfo',
    /*    headers: {
         Authorization: localStorage.getItem('token') || ''
       }, */
    success: function (res) {
      if (res.status !== 0) return layui.layer.msg(res.message)
      // 调用渲染方法
      // console.log(res)
      render(res.data)
    },
  })
}


// 封装一个渲染头像的犯法
function render(info) {
  // 获取用户名称
  const name = info.nickname || info.username
  // console.log(name)
  $('.welcome').html('欢迎&nbsp&nbsp' + name)
  // 按需渲染用户头像
  if (info.user_pic !== null) {
    $('.layui-nav-img').prop('src', info.user_pic).show
    $('.text-avatar').hide()
  } else {
    $('.layui-nav-img').hide()
    const first = name.substring(0, 1).toUpperCase()
    $('.text-avatar').html(first).show()
  }
}