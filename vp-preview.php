<?php if(!defined('__TYPECHO_ADMIN__')) exit; ?>

<div class="col-mb-12 col-tb-9 Version-view hidden">

    <p><label class="typecho-label" style="font-size: 1.2rem;">历史版本预览</label></p>

    <div class="Version-view-container">
        <textarea autocomplete="off" rows="30" readonly class="w-100 mono Version-view-container-text" style="height: <?php $options->editorSize(); ?>px">请选择一个时间点</textarea>
        <div class="version-diff w-100 mono hidden" style="height: <?php $options->editorSize(); ?>px"></div>
    </div>

</div>
