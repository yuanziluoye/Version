<?php if(!defined('__TYPECHO_ADMIN__')) exit; ?>

<?php
	$page = $pageOrPost;

	$db = Typecho_Db::get();
	$prefix = $db->getPrefix();
	$table = $prefix . 'verion_plugin';
	$rows = $db->fetchAll($db->select()->from($table)->where("cid = ? ", $page->cid)->order('time', Typecho_Db::SORT_DESC));
?>

<div id="tab-verions" class="tab-content hidden p">
	<p><label class="typecho-label"><?php _e('Tips: 鼠标悬停可以查看具体的时间'); ?></label></p>
	<p><label class="typecho-label"><?php _e('注意：回退时会覆盖当前编辑器内已有内容,请注意保存'); ?></label></p>
	<!-- <section  class="typecho-post-option" role="application">
		<label class="typecho-label">重新加载数据</label>
		<p><button class="btn primary" id="btn-verion-refresh">刷新</button></p>
	</section> -->

	<div class="typecho-table-wrap version-plugin-table-wrap-narrow">
		<table class="typecho-list-table">
			<colgroup>
				<col width="60%"/>
				<col width="40%"/>
			</colgroup>

			<thead>
				<tr>
					<th><?php _e('时间轴'); ?></th>
					<th><?php _e('编辑者'); ?></th>
				</tr>
			</thead>

			<tbody>
				<?php foreach($rows as $row): ?>
				<?php 
					$_time = date("Y/m/d H:i:s", $row['time']);
					$_time_s = date("m月d H:i", $row['time']);
					$_user = $db->fetchRow($db->select()->from('table.users')->where('uid = ?', $row['modifierid']));
					$_artical = $db->fetchRow($db->select()->from('table.contents')->where('cid = ?', $row['cid']));
				?>
					<tr class="version-plugin-row" title="<?php _e($_time) ?>">
						<td>
							<div class="version-plugin-row-short-time">
								<?php _e($_time_s); ?>
							</div>
							<div class="version-plugin-row-long-time">
								<?php _e($_time); ?>
							</div>
							
						</td>
						<td>
							<div class="version-plugin-modifier">
								<?php _e($_user['screenName']); ?>
							</div>

							<div class="version-plugin-actions">

								<button type="button" class="btn primary version-plugin-btn version-plugin-revert"
										artical-name="<?php _e($_artical['title']); ?>"
										version-id="<?php _e($row['vid']); ?>" 
										modifier="<?php _e($_user['screenName']); ?>"
										time="<?php _e($_time); ?>"
									><?php _e('退'); ?></button>

								<button type="button" class="btn primary version-plugin-btn version-plugin-delete"
									artical-name="<?php _e($_artical['title']); ?>"
									version-id="<?php _e($row['vid']); ?>" 
									modifier="<?php _e($_user['screenName']); ?>"
									time="<?php _e($_time); ?>"
								><?php _e('删'); ?></button>

							</div>
							
							
						</td>
					</tr>
				<?php endforeach; ?>
			</tbody>
			
		</table>
	</div>
	
</div>