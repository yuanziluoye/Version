<?php
/**
 * 对文章增加简单的修改记录功能(包括文章和独立页面)<br/>项目地址: <a href="https://github.com/innc11/Version">innc11/Version</a>
 *
 * @package Version
 * @author innc11
 * @version 1.0
 * @link https://innc11.cn
 */

if (!defined('__TYPECHO_ROOT_DIR__')) exit;

class Version_Plugin implements Typecho_Plugin_Interface
{
	public static function activate()
	{
		$result = self::install();

		// 插入JS
		Typecho_Plugin::factory('admin/write-post.php')->bottom = ['Version_Plugin', 'inject'];
		Typecho_Plugin::factory('admin/write-page.php')->bottom = ['Version_Plugin', 'inject'];

		// 监听事件
		Typecho_Plugin::factory('Widget_Contents_Post_Edit')->finishPublish =  ['Version_Plugin', 'onPostPublish'];
		Typecho_Plugin::factory('Widget_Contents_Post_Edit')->finishSave =     ['Version_Plugin', 'onPostSave'];
		Typecho_Plugin::factory('Widget_Contents_Page_Edit')->finishPublish =  ['Version_Plugin', 'onPagePublish'];
		Typecho_Plugin::factory('Widget_Contents_Page_Edit')->finishSave =     ['Version_Plugin', 'onPageSave'];

		// 注册路由
		Helper::addRoute("Version_Plugin_Revert", "/version-plugin/revert", "Version_Action", 'revert');
		Helper::addRoute("Version_Plugin_Delete", "/version-plugin/delete", "Version_Action", 'delete');

		return $result;
	}

	public static function deactivate()
	{
		$config = Typecho_Widget::widget('Widget_Options')->plugin('Version');

		if ($config->clean == 'yes')
		{
			$db = Typecho_Db::get();
			$script = self::getSQL('Clean');
			
			foreach ($script as $statement)
				$db->query($statement, Typecho_Db::WRITE);
		}
		
		Helper::removeRoute("Version_Plugin_Revert");
		Helper::removeRoute("Version_Plugin_Delete");
	}

	public static function render()
	{
		
	}

	public static function personalConfig(Typecho_Widget_Helper_Form $form)
	{

	}

	public static function config(Typecho_Widget_Helper_Form $form)
	{

		$desc = new Typecho_Widget_Helper_Form_Element_Text('desc', NULL, '', _t('代码参考:'),
            _t('<ol>
					<li>
						<a href="https://github.com/typecho/typecho/blob/5ba2f03206824e33036a56bad0cf46ac318d6a77/var/Widget/Archive.php">Typecho项目</a> | 
						<a href="https://github.com/kokororin/typecho-plugin-Access">Access插件</a> | 
						<a href="http://www.imhan.com/archives/typecho-links/">Link友链插件</a> | 
						<a href="https://dt27.org/php/editormd-for-typecho/">EditorMD插件</a>
					</li>
				</ol>'));
		$form->addInput($desc);

		echo '<script> window.onload = function() { document.getElementsByName("desc")[0].type = "hidden"; } </script>';

		$clean = new Typecho_Widget_Helper_Form_Element_Radio(
            'clean', array(
                'yes' => '删除',
                'no' => '不删除',
			), 'no', '删除数据表:', '是否在禁用插件时，删除所有文章的修改记录？');
			
        $form->addInput($clean);
	}

	public static function inject($pageOrPost)
	{
		$options = Typecho_Widget::widget('Widget_Options');
		echo '<script src="' . $options->pluginUrl . '/Version/js/inject.js"></script>' . PHP_EOL;
		echo '<link rel="stylesheet" href="' . $options->pluginUrl . '/Version/css/main.css"/>' . PHP_EOL;

		ob_start();
		include 'injection/tab.php';
		$content = ob_get_clean();

		echo "<script>version_plugin_inj(`" . $content . "`)</script>" . PHP_EOL;
	}

	public static function onPostPublish($contents, $that)
	{
		self::record($contents, $that);
	}

	public static function onPostSave($contents, $that)
	{
		self::record($contents, $that);
	}

	public static function onPagePublish($contents, $that)
	{
		self::record($contents, $that);
	}

	public static function onPageSave($contents, $that)
	{
		self::record($contents, $that);
	}

	public static function record($contents, $that)
	{
		$type = $contents['type'];

		$user = Typecho_Widget::widget('Widget_User');
		$user->hasLogin();

		$db = Typecho_Db::get();
		$prefix = $db->getPrefix();
		$time = Helper::options()->gmtTime + (Helper::options()->timezone - Helper::options()->serverTimezone);
		$uid = $user->uid;
		
		$row = [
			"cid" => $that->cid,
			'text' => $contents['text'],
			'type' => $type,
			'time' => $time,
			'modifierid' => $uid,
			'comment' => NULL
		];
		
		$db->query($db->insert($prefix.'verion_plugin')->rows($row));
	}

	public static function getSQL($file)
	{
		$db = Typecho_Db::get();
		$prefix = $db->getPrefix();

		$config = Typecho_Widget::widget('Widget_Options');
		$script = file_get_contents($config->pluginUrl . '/Version/sql/' . $file . '.sql');
		$script = str_replace('%prefix%', $prefix, $script);
		$script = str_replace('%charset%', 'utf8', $script);
		$script = explode(';', $script);

		$statements = [];

		foreach ($script as $statement)
		{
			$statement = trim($statement);

			if ($statement)
				array_push($statements, $statement);
		}

		return $statements;
	}

	public static function install()
	{
		$db = Typecho_Db::get();
		$dbType = array_pop(explode('_', $db->getAdapterName()));
		$prefix = $db->getPrefix();

		try {

			$script = self::getSQL($dbType);

			foreach ($script as $statement)
				$db->query($statement, Typecho_Db::WRITE);

			return '插件启用成功';

		} catch (Typecho_Db_Exception $e) {
			$code = $e->getCode();
			
			if(($dbType == 'Mysql' && $code == 1050) || ($dbType == 'SQLite' && ($code =='HY000' || $code == 1)))
			{
				try {
					$script = self::getSQL("Check");

					foreach ($script as $statement)
						$db->query($statement, Typecho_Db::READ);

					return '插件启用成功';
				} catch (Typecho_Db_Exception $e) {
					$code = $e->getCode();

					throw new Typecho_Plugin_Exception('无法建立数据表 ErrorCode：'.$code);
				}
			} else {
				throw new Typecho_Plugin_Exception('无法建立数据表 ErrorCode：'.$code);
			}
		}

	}

	
}