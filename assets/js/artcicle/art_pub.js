$(function () {
  const layer = layui.layer
  const url = 'http://www.liulongbin.top:3007'
  const form = layui.form
  // 初始化文本编辑器
  initEditor()
  // 定义加载文章分类的下拉框
  function initCate() {
    $.ajax({
      method: "GET",
      url: url + '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message)
        console.log(res)
        // 调用模板引擎
        const htmlStr = template('tpl', res)
        $('[name=cate_id]').html(htmlStr)
        // 记得调用render方法
        form.render()

      }

    })
  }
  initCate()



  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)


  // 点击选择封面
  $('.btn-set').on('click', function () {
    $('#coverfile').click()
  })


  // 监听file文件的change事件 获取用户选择的文件
  $('#coverfile').on('change', function (e) {
    // 获取文件列表数组
    const files = e.target.files
    if (files.length <= 0) return layer.msg('请选择文件')
    // 将文件转化陈路径
    const newImgURL = URL.createObjectURL(files[0])
    // 为裁剪区重新设置图片

    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  // 定义文章发布状态
  let atr_state = '已发布'
  // 点击存为草稿 绑定事件
  $('.btn-draft').on('click', function () {
    atr_state = '草稿'
  })

  // 为表单绑定提交事件
  $('#formId').on('submit', function (e) {
    e.preventDefault()
    // 基于form表单快速创建formDate对象
    const fd = new FormData($(this)[0])
    // console.log(fd)
    // 将文章发布状态添加
    fd.append('state', atr_state)
    /*  fd.forEach(function (k, v) {
       console.log(k, v)
     }) */
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img', blob)
        // 发起ajax请求
        pubArtcicle(fd)
      })

  })

  function pubArtcicle(fd) {
    $.ajax({
      method: 'POST',
      url: url + '/my/article/add',
      data: fd,
      // 如果提交的是FormDate格式 必须添加一下格式
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message)
        layer.msg('发布文章成功')
        // 成功后跳转到文章列表也
        location.href = '/article/art_list.html'
      }
    })
  }
})