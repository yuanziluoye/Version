$(function(){

	$('.version-plugin-revert').click(function(e){
		var articalName = $(this).attr('artical-name')
		var versionId = $(this).attr('version-id')
		var modifier = $(this).attr('modifier')
		var time = $(this).attr('time')

		var message = "确定要回退到 "+time+" 的时候吗?\n"
		message += articalName+" 由 "+modifier+" 修改\n"
		message += "回退将会覆盖当前内容,请注意保存!"

		if(confirm(message)) {
			$.ajax({
				url: location.origin + "/version-plugin/revert?vid="+versionId,
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
		var articalName = $(this).attr('artical-name')
		var versionId = $(this).attr('version-id')
		var modifier = $(this).attr('modifier')
		var time = $(this).attr('time')
		var _this = this

		var message = "确定要删除这个版本吗?"

		if(confirm(message)) {
			$.ajax({
				url: location.origin + "/version-plugin/delete?vid="+versionId,
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

})


function version_plugin_inj(content)
{
	var seul = $('#edit-secondary ul').eq(0)

	// 调整宽度
	seul.find('li').eq(0).removeClass("w-50")
	seul.find('li').eq(1).removeClass("w-50")
	seul.find('li').eq(0).addClass("w-30")
	seul.find('li').eq(1).addClass("w-30")
	
	seul.append('<li class="w-40"><a href="#tab-verions" id="tab-verions-btn">历史版本</a></li>')

		// 从新执行一下切换函数()
			// 控制选项和附件的切换(Copy自write-js.php)
			var fileUploadInit = false;
			$('#edit-secondary .typecho-option-tabs li').unbind('click')
			$('#edit-secondary .typecho-option-tabs li').click(function() {
				$('#edit-secondary .typecho-option-tabs li').removeClass('active');
				$(this).addClass('active');
				$(this).parents('#edit-secondary').find('.tab-content').addClass('hidden');
				
				var selected_tab = $(this).find('a').attr('href'),
					selected_el = $(selected_tab).removeClass('hidden');

				if (!fileUploadInit) {
					selected_el.trigger('init');
					fileUploadInit = true;
				}

				return false;
			});
	
	var se = $('#edit-secondary')
	se.append(content)
}
