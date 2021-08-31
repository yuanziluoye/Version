function version_plugin_init()
{
    $('.Version-btn-revert').click(function(e){
        var vid = $(this).parent().parent().parent().attr('version-id')
        var time = $(this).parent().parent().parent().attr('time')

        var message = "确定要回退到 "+time+" 的时候吗?"

        if(confirm(message)) {
            $.ajax({
                url: location.origin + window.baseUrl + "/version-plugin/revert",
                data: {vid: vid},
                cache: false,
                type: 'GET',
                success: function (data) {
                    window.location.reload()
                },
                error: function (xhr, status, error) {
                    alert("回退失败")
                }
            });
        }
    })

    $('.Version-btn-delete').click(function(e){
        var vid = $(this).parent().parent().parent().attr('version-id')
        var _this = this

        var message = "确定要删除这个版本吗?"

        if(confirm(message)) {
            $.ajax({
                url: location.origin + window.baseUrl + "/version-plugin/delete",
                data: {vid: vid},
                cache: false,
                type: 'GET',
                success: function(data) {
                    $(_this).parent().parent().parent().remove();
                },
                error: function(xhr, status, error) {
                    alert("删除失败")
                }
            });
        }
    })

    $('.Version-row').click(function(e){
        if(e.target.nodeName!='TD') // 实测点不到tr，只能点到td
            return

        var vid = $(this).attr('version-id')
        var time = $(this).attr('time')

        $('.Version-view').removeClass('hidden')
        $('.Version-view-container-text').text('内容正在加载...')
        $('.Version-view-actionbar').attr('version-id', vid)

        $.ajax({
            url: location.origin + window.baseUrl + "/version-plugin/preview",
            data: {vid: vid},
            cache: false,
            type: 'GET',
            success: function(data) {
                // 去掉开头的md标识
                var reg = new RegExp("^<!\-\-markdown\-\->", "g")
                data = data.replace(reg, "")

                $('.version-diff').addClass('hidden');
                $('.Version-view-container-text').removeClass('hidden').text(data)

                $('.Version-view p label').html('历史版本预览('+time+')')

                var Text = document.querySelector('.Version-view-container-text')
                Text.scrollTop = Text.scrollHeight
            },
            error: function(xhr, status, error) {
                alert("内容加载失败")
            }
        });
    })

    // 保存版本标签
    var saveDes = function(e, _this)
    {
        var vid = _this.parent().parent().parent().attr('version-id')
        var last = _this.attr('last')
        var label = _this.val()

        if(last!=label)
        {
            _this.attr('last', label)
            _this.val('正在设置标签..')

            $.ajax({
                url: location.origin + window.baseUrl + "/version-plugin/comment",
                data: {vid: vid, comment: label},
                cache: false,
                type: 'GET',
                success: function(data) {
                    _this.val(label)
                },
                error: function(xhr, status, error) {
                    _this.val('标签设置失败')
                    alert('标签设置失败')
                }
            })
        }
    }

    // 失去焦点时保存
    $('.Version-row-label input').bind('blur', function (e){
        saveDes(e, $(this))
    });
    // 回车时保存
    $('.Version-row-label input').bind('keydown blur', function (e){
        var key = e.which;

        if (key == 13) {
            saveDes(e, $(this))
            e.stopPropagation()
            return false
        }
    });


}

/**
 * 历史版本 range slider
 */
function versionRangeSlider() {
    var stepsSlider = $('.js-version-range-slider').get(0);
    if (!stepsSlider) {
        return;
    }

    noUiSlider.create(stepsSlider, {
        start: [window.firstVid, window.lastVid],
        connect: true,
        range: {
            min: 1,
            max: Object.values(window.vids).length
        },
        step: 1,
        margin: 1,
        behaviour: 'tap-drag',
        tooltips: true,
        pips: {
            mode: 'steps',
            density: -1
        },
        format: {
            from: function (value) {
                return parseInt(value);
            },
            to: function (value) {
                return parseInt(value);
            }
        }
    });

    var tooltips = stepsSlider.noUiSlider.getTooltips();
    stepsSlider.noUiSlider.on('update', function (values, handle, unencoded, tap, positions) {
        var vids = window.vids;
        var vidArr = Object.values(window.vids);
        var item = vidArr[values[handle] - 1];
        tooltips[handle].innerHTML = vids[item.vid].time;

        var compare = '';
        for (var i = 0; i < values.length; ++i) {
            var oneVid = vidArr[values[i] - 1];
            compare += i !== values.length - 1 ? oneVid.vid + ',' : oneVid.vid;
        }

        $.ajax({
            url: location.origin + window.baseUrl + "/version-plugin/compare",
            data: {vids: compare},
            cache: false,
            type: 'GET',
            success: function (res) {
                if (typeof res.code === 'undefined') {
                    alert('加载版本对比数据失败');
                    return;
                }

                var reg = new RegExp("^<!\-\-markdown\-\->", "g");
                var data = res.data;
                var one, other;
                one = data[0].text.replace(reg, "");
                other = data[1].text.replace(reg, "");

                var color = '', span = null;
                var diff = Diff.diffChars(one, other),
                div = document.createElement('div');
                diff.forEach(function (part) {
                    part.value = part.value.replace(/(?:\r\n|\r|\n)/g, '<br>');
                    color = part.added ? 'blue' :
                        part.removed ? 'red' : '';
                    span = document.createElement('span');
                    span.style.color = color;
                    span.innerHTML = part.value;
                    div.appendChild(span);
                });

                $('.Version-view-container-text').addClass('hidden');
                $('.version-diff').removeClass('hidden').html(div.innerHTML);
            },
            error: function (xhr, status, error) {
                alert('加载版本对比数据失败');
            }
        });
    });
}

function version_plugin_execute(content, content2, vers)
{
    $(function(){
        // 保证最后执行
        setTimeout(function(){
            // 添加按钮到选项卡上
            var seul = $('#edit-secondary ul').eq(0)

            // 调整宽度
            seul.find('li').eq(0).removeClass("w-50")
            seul.find('li').eq(1).removeClass("w-50")
            seul.find('li').eq(0).addClass("w-30")
            seul.find('li').eq(1).addClass("w-30")

            seul.append('<li class="w-40"><a href="#tab-verions" id="tab-verions-btn">历史版本'+(vers>0?("("+vers+")"):"")+'</a></li>')

            // 重写自动保存的部分
            version_plugin_overwrite() // 为了搞这个，我都要崩溃了

            // 添加选项卡里面的按钮和表格
            var se = $('#edit-secondary')
            se.append(content)

            // 添加预览框
            var form = $('.row.typecho-page-main.typecho-post-area form')
            form.prepend(content2)

            // 控制编辑器和预览框的切换
            $('#edit-secondary .typecho-option-tabs li').click(function() {
                if($("#tab-verions-btn", $(this)).length>0)
                {
                    $('.Version-view').removeClass('hidden')
                    $('.col-mb-12.col-tb-9[role="main"]', form).addClass('hidden')
                }else{
                    $('.Version-view').addClass('hidden')
                    $('.col-mb-12.col-tb-9[role="main"]', form).removeClass('hidden')
                }
            });

            // 监听事件
            version_plugin_init()
            versionRangeSlider()
        }, 200)
    })
}
