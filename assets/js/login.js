$(function () {
  // 定义一个共同的url根路径
  const url = 'http://www.liulongbin.top:3007'
  // 点击注册按钮会触发登录
  $('.loginBox a').eq(0).on('click', function () {
    $('.login-box').css('display', 'none')
    $('.register').css('display', 'block')
  })
  $('.loginBox a').eq(1).on('click', function () {
    $('.login-box').css('display', 'block')
    $('.register').css('display', 'none')
  })



  //layui获取form 对象
  const form = layui.form
  const layer = layui.layer
  // console.log(form)
  // 通过form verify 自定义校验规则
  form.verify({
    pass: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    // 校验密码是否一致
    repass: function (value) {
      const pwd = $('.register [name=password]').val()
      if (pwd !== value) return '两次密码不一致'
    }
  })



  // 监听注册表单提交哦时间
  $('#form-reg').on('submit', function (e) {
    e.preventDefault()
    $.post(`${url}/api/reguser`,
      {
        username: $('.register [name=username]').val(),
        password: $('.register [name=password]').val()
      }, function (res) {
        if (res.status !== 0) return layer.msg(res.message)
        layer.msg('注册成功')
        // 模拟人的点击行为
        $('.loginBox a').eq(1).click()
      })
  })

  // 监听 登录表单的提交事件
  $('#login-form').submit(function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: 'http://www.liulongbin.top:3007/api/login',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg('res.message')
        layer.msg('登录成功')
        // console.log(res)
        // 将数据存储到本地中
        localStorage.setItem('token', res.token)
        // 跳转到主页
        location.href = '/index.html'
      }
    })
  })

})