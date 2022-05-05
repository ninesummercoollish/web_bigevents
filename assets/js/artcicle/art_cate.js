$(function () {
  // 获取文章分类列表
  const url = 'http://www.liulongbin.top:3007'
  const layer = layui.layer
  const form = layui.form
  initArtList()
  function initArtList() {
    $.ajax({
      method: 'GET',
      url: url + '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message)
        // console.log(res)
        // 调用模板引擎
        const htmlStr = template('tpl', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 添加类别
  let index = null
  $('#btnAdd').on('click', function () {
    index = layer.open({
      title: '添加文章类别',
      type: 1,
      content: $('#alert').html(),
      area: ['500px', '300px']
    });
  })
  // 这里的index时每个layer.open调用后的索引值


  // 通过事件代理为添加绑定事件
  $('body').on('submit', '#formId', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: url + '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message)
        layer.msg('添加成功')
        // 重新渲染页面
        initArtList()
        // 关闭弹出层
        layer.close(index)
        // console.log(res)
      }
    })
  })

  let i = null
  // 通过事件代理为编辑按钮添加事件
  $('tbody').on('click', '#btn-edit', function () {
    i = layer.open({
      title: '修改文章分类'
      , content: $('#edit').html()
      , type: 1,
      area: ['500px', '300px']
    })
    // 点击时获取对应的id
    const id = $(this).attr('data-id')
    // console.log(id)
    // 发起请求获取对应的分类数据
    $.ajax({
      method: 'GET',
      url: url + '/my/article/cates/' + id,
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message)
        // console.log(res)
        layer.msg('获取数据成功')
        form.val('formId', res.data)
      }
    })
  })
  // 通过事件代理点击编辑更新提交按钮
  $('body').on('submit', '#formEdit', function (e) {
    e.preventDefault()
    // alert(11)
    $.ajax({
      method: 'POST',
      url: url + '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message)
        layer.msg('更新分类数据成功')
        initArtList()
        layer.close(i)
      }
    })

  })


  // 通过代理形式为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    const id = $(this).attr('data-id')
    // 提示用户是否删除
    layer.confirm('是否确定删除', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: url + '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) return layer.msg(res.message)
          layer.msg('删除文章分类成功')
          initArtList()
        }
      })
      layer.close(index);
    })
  })
})