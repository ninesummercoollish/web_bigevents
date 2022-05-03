// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  if (options.url.indexOf('/my/') !== -1) {
    // console.log(11)
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }


    // 全局统一挂在complete回调函数
    options.complete = function (res) {
      const { responseJSON: { status, message } } = res
      if (status === 1 && message === '身份认证失败！') {
        localStorage.removeItem('token')
        location.href = '/login.html'
      }
    }
  }
})
