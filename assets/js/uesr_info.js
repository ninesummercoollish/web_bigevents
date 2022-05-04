$(function () {
  const url = 'http://www.liulongbin.top:3007'
  const layer = layui.layer
  const form = layui.form
  form.verify({
    nickname: function (value) {
      if (value.length > 6) return '长度必须在1到6位之间'
    }
  })


  // 初始化用户信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: url + '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message)
        console.log(res)
        // 调用 form.val() 快速为表单赋值
        const { email, nickname, username, id } = res.data
        $('#loginName').val(username)
        $('#nickName').val(nickname)
        $('#eamilName').val(email)
        $('#hiddenId').val(id)
      }
    })
  }
  initUserInfo()


  // 重置表单数据
  $('#reset').on('click', function (e) {
    e.preventDefault()
    initUserInfo()
  })


  // 监听表单的提交事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: url + '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        // console.log(r)
        if (res.status !== 0) return layer.msg(res.message)
        layer.msg('更新用户信息成功')
        // 调用父页面方法重新渲染用户信息
        window.parent.getUserInfo()
      }
    })
  })
})