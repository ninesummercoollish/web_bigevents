$(function () {
  const url = 'http://www.liulongbin.top:3007'
  const layer = layui.layer
  const form = layui.form
  const laypage = layui.laypage;
  // 定义一个查询对象 请求服务器数据时将参数提交给服务器
  const q = {
    pagenum: 1, //默认请求第一页的数据
    pagesize: 2, //默认每页显示几条数据
    cate_id: '', //文章分类的id
    state: '' //文章的发布状态
  }
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)
    let y = dt.getFullYear()
    let m = dt.getMonth() + 1
    let d = dt.getDate()
    let h = dt.getHours()
    h = h < 10 ? '0' + h : h
    let min = dt.getMinutes()
    min = min < 10 ? '0' + min : min
    let s = dt.getSeconds()
    s = s < 10 ? '0' + s : s
    return `${y}-${m}-${d} ${h}:${min}:${s}`
  }
  // 获取文章列表数据的犯法
  function initTable() {
    $.ajax({
      methood: 'GET',
      url: url + '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message)
        layer.msg('获取文章列表成功')
        // console.log(res)
        // 使用模板引擎渲染数据
        const htmlStr = template('tpl', res)
        $('tbody').html(htmlStr)
        // 调用渲染分页的方法
        // res.total是文章的总条数
        renderPage(res.total)

      }
    })
  }

  initTable()

  // 初始化文章分类方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: url + '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message)
        // 调用模板要求分类可选想
        const htmlStr = template('tpl-cate', res)
        // console.log(htmlStr)
        $('[name=cate_id]').html(htmlStr)
        // 这是通知layui重新渲染layui结构
        form.render()
        console.log(res)
      }
    })
  }

  initCate()



  // 为筛选表单绑定提交事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    //获取表单选中的值
    const cate_id = $('[name=cate_id]').val()
    const state = $('[name=state]').val()
    // console.log(state, cate_id)
    // 为查询对象q 赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的条件重新渲染数据
    initTable()
  })



  // 定义渲染分页的方法
  function renderPage(total) {
    //  调用layui的分页方法 渲染页面
    laypage.render({
      elem: 'pageBox', //注意，这里的 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize,  //每页显示几条
      limits: [2, 3, 5, 10],
      curr: q.pagenum, //默认选择的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      //分页发生切换时触发回调
      //1. jump点击页码触发jump回调
      // 2.调用render方法时触发回调
      jump: function (obj, first) {
        console.log(first)
        // console.log(obj.curr)
        // 把最新的页码值赋值到q对象中
        q.pagenum = obj.curr
        // 把最新的条目数赋值到q查询对象
        q.pagesize = obj.limit
        // first判断是否由点击页面触发 如果是就undefinded
        if (!first) initTable()
      }
    })
  }

  // 通過代理的形式為刪除按鈕綁定時間
  $('tbody').on('click', '.btn-delete', function () {
    const id = $(this).attr('data-id')
    // 获取当前页面删除按钮的个数
    const len = $('.btn-delete').length
    // console.log(len)
    // console.log(id)
    // 詢問用戶是否是否刪除數據
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: url + '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) return layer.msg(res.message)
          layer.msg('删除文章成功')
          // 当数据删除完成后判断当前这一页是否还有数据 如果没有就让页码值减一
          // 重新调用initTable方法
          if (len <= 1) {
            q.pagenum = q.pagenum === 1 ? q.pagenum : q.pagenum - 1
          }
          initTable()
        }
      })

      layer.close(index);
    });

  })
  // 编辑按钮绑定事件
  /*  $('tbody').on('click', '.btn-edit', function () {
     const id = $(this).attr('data-id')
     $.ajax({
       method: "POST",
       url: url + '/my/article/edit',
     })
   }) */

})