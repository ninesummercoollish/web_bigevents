$(function () {
  const layer = layui.layer
  const url = 'http://www.liulongbin.top:3007'
  // 用户输入密码时可以查看
  let flag = 1;
  $('.hideImg').on('click', function () {
    if (flag === 1) {
      $(this).prop('src', '/images/眼睛_显示_o.png')
      $(this).siblings('input').prop('type', 'text')
      flag = 0
    } else if (flag === 0) {
      $(this).prop('src', '/images/眼睛_隐藏_o.png')
      $(this).siblings('input').prop('type', 'password')
      flag = 1
    }
  })


  // 自定义校验规则
  const form = layui.form
  form.verify({
    pass: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    samePwd: function (value) {
      if (value === $('#old').val()) {
        return ('新旧密码不能一致')
      }
    },
    rePwd: function (value) {
      if (value !== $('#new').val()) return ('两次密码不一致')
    }
  })


  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: url + '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message)
        console.log(res)
        layer.msg('密码更新成功')
        // 更新成功清空表单
        $('.layui-form')[0].reset()
      }
    })
  })
})