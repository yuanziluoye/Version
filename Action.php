<?php

if (!defined('__TYPECHO_ROOT_DIR__')) exit;

class Version_Action extends Typecho_Widget implements Widget_Interface_Do
{
	public function __construct($request, $response, $params = null)
    {
        parent::__construct($request, $response, $params);

    }

    public function execute()
    {

    }

    public function action()
	{

    }

    public function permissionCheck()
    {
        $user = Typecho_Widget::widget('Widget_User');
        
        if(!$user->pass('editor', true))
            throw new Typecho_Widget_Exception(_t('没有编辑权限'), 403);
    }
	
	public function revert()
	{
        $this->permissionCheck();

        $vid = $this->request->get('vid');

        if(!isset($vid))
            throw new Typecho_Widget_Exception(_t('参数不正确'), 503);
        
        $vid = intval($vid);

        $db = Typecho_Db::get();
        $prefix = $db->getPrefix();
        $table = $prefix . 'verion_plugin';
        $row = $db->fetchRow($db->select()->from($table)->where('vid = ? ', $vid));

        $cid = $row['cid'];

        $raw = $db->fetchRow($db->select()->from('table.contents')->where("cid = ? ", $cid));
        $raw['text'] = $row['text'];

        $db->query($db->update('table.contents')->rows($raw)->where('cid = ? ', $cid));
        
        $this->response->setContentType('image/gif');
        echo base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAQUAP8ALAAAAAABAAEAAAICRAEAOw==');
    }
    
    public function delete()
	{
        $this->permissionCheck();

        $vid = $this->request->get('vid');

        if(!isset($vid))
            throw new Typecho_Widget_Exception(_t('参数不正确'), 503);
        
        $vid = intval($vid);

        $db = Typecho_Db::get();
        $prefix = $db->getPrefix();
        $table = $prefix . 'verion_plugin';

        $db->query($db->delete($table)->where('vid = ? ', $vid));
        
        $this->response->setContentType('image/gif');
        echo base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAQUAP8ALAAAAAABAAEAAAICRAEAOw==');
	}

}