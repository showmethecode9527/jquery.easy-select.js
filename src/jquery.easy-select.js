;(function ($) {
    'use strict';
    $.fn.easySelect = function (userConf) {
        var defaultConf = {
            placeholder: '',
            // 必须是对象数组
            data: [],
            valueField: '',
            textField: '',
            item: -1,
            addItemTips: '新增',
            addItemCallback: false,
            removeItemCallback: false
        };

        var conf = $.extend(defaultConf, userConf);

        return this.each(function () {
            var $me = $(this);
            $me.data('easySelectConf', conf);
            // 检查设置项
            checkConf(conf);
            // 生成节点
            generateNodes($me);
            // 设置默认值
            setDefaultItem($me);
            fillPlaceholder($me);
            // 设置样式
            setStyles($me);
            addEvent($me);
        });

        /**
         * 生成下拉列表节点
         * @author wangk 2016-10-19T19:44:15+0800
         * @param  {[type]} $node [description]
         * @return {[type]}       [description]
         */
        function generateNodes($node) {
            // 选中的值填充到该容器
            $node.html('<div class="selected-value"></div>');

            var str = '<div class="easy-options-wrapper" style="display:none;">';
            // data 一定是非空数组, 否则走不到这一步
            var data = conf.data;
            var textField = conf.textField;
            var valueField = conf.valueField;
            var addItemTips = conf.addItemTips;
            var addItemCallback = conf.addItemCallback;

            if (textField === '') {
                data.forEach(function (v) {
                    // str += '<div class="easy-option" title="' + v + '">' + v + '</div>';
                    str += '<div class="easy-option">' + v + '</div>';
                });
            } else {
                if (valueField === '') {
                    data.forEach(function (v) {
                        // str += '<div class="easy-option" title="' + v[textField] + '">' + v[textField] + '</div>';
                        str += '<div class="easy-option">' + v[textField] + '</div>';
                    });
                } else {
                    data.forEach(function (v) {
                        // str +=  '<div class="easy-option" data-value="' + v[valueField] +
                        //                 '" data-text="' + v[textField] + '" title="' + v[textField] + '">' +
                        //             v[textField] +
                        //         '</div>';
                        str +=  '<div class="easy-option" data-value="' + v[valueField] +
                                        '" data-text="' + v[textField] + '">' +
                                    v[textField] +
                                '</div>';
                    });
                }
            }

            if (typeof addItemCallback === 'function') {
                str +=  '<div class="add-item">' +
                            '<div class="cross-icon text">' + addItemTips + '</div>' +
                        '</div>';
            }
            str += '</div>';

            // 如果生成了关联的下拉列表, 则先移除掉
            if (typeof $node[0].$options !== 'undefined') {
                $node[0].$options.remove();
            }

            var $options = $(str);

            $('body').append($options);
            // 在目标节点上存储关联的下拉列表
            // 当界面中有多个时, 方便查找
            $node[0].$options = $options;
        }

        /**
         * [fillPlaceholder description]
         * @author Mathink 2016-10-21T23:15:33+0800
         * @param  {[type]} $node [description]
         * @return {[type]}       [description]
         */
        function fillPlaceholder($node) {
            var placeholder = conf.placeholder || $node.attr('data-placeholder');
            $node.find('.selected-value').html('<span class="placeholder">' + placeholder + '</span>');
        }
        /**
         * 设置默认项
         * @author Mathink 2016-10-21T21:36:56+0800
         * @param  {[type]} $node [description]
         */
        function setDefaultItem($node) {
            var item = conf.item;
            if (item === -1) {
                return;
            }

            var data = conf.data;
            var textField = conf.textField;
            var valueField = conf.valueField;

            var $options = $node[0].$options;
            $options.find('.easy-option:eq("' + item + '")').addClass('selected');

            if (valueField !== '') {
                $node.attr('data-value', data[item][valueField]);
            }
            if (textField !== '') {
                $node.attr('data-text', data[item][textField]).html(data[item][textField]);
            } else {
                $node.attr('data-text', data[item]).html(data[item]);
            }
        }

        /**
         * 新增项
         * @author Mathink 2016-10-21T22:20:56+0800
         * @param  {[type]} $node [description]
         * @param  {[type]} data  [description]
         */
        function addItem($node, data) {
            var textField = conf.textField;
            var valueField = conf.valueField;
            var newOption = '<div class="easy-option selected" data-value="' + data[valueField] + 
                                    '" data-text="' + data[textField] + '">' + data[textField] +
                            '</div>';

            var $options = $node[0].$options;
            var $addItem = $options.find('.add-item');
            $options.find('.selected').removeClass('selected');
            if ($addItem.length === 0) {
                $options.append(newOption);
            } else {
                $addItem.before(newOption);
            }

            // 更新选中值
            $node.attr('data-value', data[valueField])
                .attr('data-text', data[textField])
                .find('.selected-value').html(data[textField]);
        }
        
        function setStyles($node) {
            $node.find('.selected-value').css({
                width: $node.innerWidth() - 28 + 'px'
            });
            // 与 $node 关联的下拉列表
            var $options = $node[0].$options;
            $options.css({
                position: 'absolute',
                'z-index': '-10',
                top: '-9999px',
                left: '-9999px'
            });
        }

                
        function addEvent($node) {
            // 在页面其他地方点击时, 隐藏下拉列表框
            $(document).on('click', function () {
                hideOptions($node);
            });

            // 下拉列表框主框事件
            $node.removeClass('options-show').addClass('options-hide').on('click', function (e) {
                e.stopPropagation();
                
                // 隐藏其他的展开的列表
                this.$options.siblings('.easy-options-wrapper').hide();
                var $me = $(this);
                
                // 如果展开, 则隐藏; 如果隐藏, 则展开
                if ($me.hasClass('options-show')) {
                    hideOptions($me.removeClass('options-show').addClass('options-hide'));
                } else {
                    showOptions($me.removeClass('options-hide').addClass('options-show'));
                }

                // showOptions($me.removeClass('options-hide').addClass('options-show'));
            }).on('blur', function (e) {
                e.stopPropagation();
                hideOptions($(this));
            });

            // 下拉列表框的每个选项点击事件
            // $node[0].$options.find('.easy-option').on('click', function (e) {
            $node[0].$options.on('click', '.easy-option', function (e) {
                e.stopPropagation();
                var $me = $(this);
                if (!$me.hasClass('selected')) {
                    $me.addClass('selected').siblings('.selected').removeClass('selected');
                }
                $me.addClass('selected').closest('.easy-options-wrapper').hide();
                $node.removeClass('options-show').addClass('options-hide')
                    .attr('data-value', $me.attr('data-value'))
                    .attr('data-text', $me.attr('data-text'))
                    .find('.selected-value').html($me.attr('data-text'));
            }).on('mouseover', '.easy-option', function (e) {
                e.stopPropagation();
                var $me = $(this);
                $me.addClass('hover').siblings('.hover').removeClass('hover');
            });

            // 新增项事件
            var addItemCallback = conf.addItemCallback;
            if (typeof addItemCallback === 'function') {
                $node[0].$options.find('.add-item').on('click', function () {
                    var addResult = addItemCallback();
                    if (addResult.result) {
                        addItem($node, addResult.data);
                    }
                }).on('mouseover', function (e) {
                    $(this).siblings('.hover').removeClass('hover');
                });
            }
        }

        /**
         * 显示下拉列表框
         * @author Mathink 2016-10-21T21:18:43+0800
         * @param  {[type]} $node [description]
         * @return {[type]}       [description]
         */
        function showOptions($node) {
            var _offset = $node.offset();
            var _x = _offset.left;
            var _y = _offset.top;
            var _h = $node.outerHeight();

            var $selectedOption = $node[0].$options.css({
                top: _y + _h + 'px',
                left: _x,
                'z-index': 10,
                display: 'block'
            }).find('.selected');

            // 如果没有选择任何项, 则默认点亮第1项
            // 否则, 点亮选中的项
            if ($selectedOption.length === 0) {
                $node[0].$options.find('.easy-option:eq(0)').addClass('hover');
            } else {
                $selectedOption.addClass('hover');
            }
        }

        function hideOptions($node) {
            $node.removeClass('options-show').addClass('options-hide');
            $node[0].$options.hide().find('.hover').removeClass('hover');
        }

        /**
         * 检查配置项
         * @author wangk 2016-10-19T19:18:10+0800
         * @param  {[type]} conf [description]
         * @return {[type]}      [description]
         */
        function checkConf(conf) {
            if (!$.isArray(conf.data)) {
                console.error('配置项"data"必须是数组');
                return;
            }

            if (conf.data.length === 0) {
                return;
            }
        }
    };
})(jQuery);