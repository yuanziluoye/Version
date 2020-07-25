$(function(){

	$('.version-plugin-revert').click(function(e){
		var articalName = $(this).parent().attr('artical-name')
		var vid = $(this).parent().attr('version-id')
		var modifier = $(this).parent().attr('modifier')
		var time = $(this).parent().attr('time')

		var message = "确定要回退到 "+time+" 的时候吗?\n"
		message += articalName+" 由 "+modifier+" 修改\n"
		message += "回退将会覆盖当前内容,请注意保存!"

		if(confirm(message)) {
			$.ajax({
				url: location.origin + "/version-plugin/revert?vid="+vid,
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

	$('.version-plugin-delete').click(function(e){
		var articalName = $(this).parent().attr('artical-name')
		var vid = $(this).parent().attr('version-id')
		var modifier = $(this).parent().attr('modifier')
		var time = $(this).parent().attr('time')
		var _this = this

		var message = "确定要删除这个版本吗?"

		if(confirm(message)) {
			$.ajax({
				url: location.origin + "/version-plugin/delete?vid="+vid,
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

	$('.version-plugin-preview').click(function(e){
		var vid = $(this).parent().attr('version-id')

		$('.version-plugin-view').removeClass('hidden')
		$('.version-plugin-text').text('内容正在加载...')

		$.ajax({
			url: location.origin + "/version-plugin/preview?vid="+vid,
			cache: false,
			type: 'GET',
			success: function(data) {
				$('.version-plugin-text').text(data)
			},
			error: function(xhr, status, error) {
				alert("内容加载失败")
			}
		});
	})


	$('.version-plugin-view').click(function(e){
		$(this).toggleClass('hidden')
	})

	$('.version-plugin-view-container').click(function(e){
		e.stopPropagation()
	})


})



function version_plugin_inj(content)
{
	setTimeout(function(){
		var seul = $('#edit-secondary ul').eq(0)

		// 调整宽度
		seul.find('li').eq(0).removeClass("w-50")
		seul.find('li').eq(1).removeClass("w-50")
		seul.find('li').eq(0).addClass("w-30")
		seul.find('li').eq(1).addClass("w-30")
		
		seul.append('<li class="w-40"><a href="#tab-verions" id="tab-verions-btn">历史版本</a></li>')

		version_plugin_overwrite() // 为了搞这个，我裂开了
	}, 200)
	
	
	var se = $('#edit-secondary')
	se.append(content)
}
