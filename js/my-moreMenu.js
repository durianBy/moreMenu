/**
 * 更多条件数据获取与写入,获取更多条件勾选数据
 * @author zhangbiying
 * 参数说明：$el 需要插入的dropdwon容器
 * @date   2016/07/12
 */
(function ($) {
    $.moreMenu = function (option) {
        var url = option.url,
            $el = option.$el,
            $dropdown = $(option.id),
            data = option.data;
        if (data && data.length > 0) {
            var moreItem = '';
            $.each(data, function (n, index) {
                moreItem += '<li><label class="menuName">' + index.name + '：</label>' + '<a class="no-limited" querytype="' + index.value[0].querytype + '">不限</a>';
                if (index.value.length > 0) {
                    $.each(index.value, function (i, el) {
                        moreItem += '<label class="label-checkbox"><input type="checkbox" querytype="' + el.querytype + '" code="' + el.code + '">' + el.name + '</label>';
                    })
                }
                moreItem += '</li>';
            });
            moreItem += '<a class="resetMoreBtn">重置筛选条件</a>';
            $el.empty();
            $el.append(moreItem);
            //绑定下拉菜单收起事件
            $dropdown.parent().on("hidden.bs.dropdown",function(){
                //获取勾选数据
                var length = $("[type=checkbox]:checked",$el).length;
                if(length){//若更多条件有勾选
                    $dropdown.addClass("mark-red");
                }else{
                    $dropdown.removeClass("mark-red");
                }
            })
        } else {
            //若获取到的更多条件为空，更多条件按钮置灰
            $el.siblings("a").addClass("disabled");
            /*$.toast({
             message: "暂无更多条件",
             state: false
             });*/
        }

    };
    //获取更多条件勾选数据情况
    $.fn.moreMenuGetData = function (data) {
        var $this = this;
        $("[type=checkbox]:checked", $this).each(function (n, el) {
            var queryType = $(el).attr("querytype"),
                code = $(el).attr("code");
            if (!data[queryType]) { //若未定义，则先定义
                data[queryType] = [];
                data[queryType] += code;
            } else {
                data[queryType] += ',' + code;
            }
        });
    };

    $(document).on("click change", ".label-checkbox>[type=checkbox],a.no-limited,a.resetMoreBtn", function (e) {
        var $el = $(e.currentTarget),
            $parentLi = $el.parents("li"),
            querytype = $el.attr("querytype"),

            $dropDownMenu = $el.parent(),
            $parentLabel = $(this).parent(),
            $noLimit = $('.no-limited[querytype="'+querytype+'"]',$parentLi);
        if($el.attr("type")){//checkbox点击逻辑
            if ($el.is(':checked')) {
                $parentLabel.addClass("active");//label标签加active
                if(!$noLimit.hasClass('usable')){
                    $noLimit.addClass("usable");
                }
            } else {
                $parentLabel.removeClass("active");
                if($noLimit.hasClass('usable')){
                    if($("[type=checkbox][querytype="+querytype+"]:checked",$parentLi).length == 0){
                        $noLimit.removeClass("usable")
                    }
                }
            }
        }else if($el.hasClass("no-limited")){//不限按钮逻辑
            //判断不限按钮是否可用
            if ($el.hasClass("usable")) {
                //本行checkbox取消勾选
                $("[type=checkbox][querytype=" + querytype + "]:checked", $parentLi).each(function (n, el) {
                    $(el).attr("checked", false).trigger("change");
                });
                //不限按钮状态置为不可用
                $el.removeClass("usable")
            }
        }else{//重置筛选按钮逻辑
            e.stopPropagation();
            var $dropDownMenu = $(e.currentTarget).parent();
            $dropDownMenu.find(".label-checkbox").removeClass("active");
            $("input[type=checkbox]", $dropDownMenu).each(function (n, el) {
                $(el).attr("checked", false);
            });
            $(".no-limited", $dropDownMenu).each(function (n, el) {
                $(el).removeClass("usable");
            })
        }
    });

    // dropdown下拉控件阻止冒泡
    $(document).on("click", ".dropdown-more-menu", function (e) {
        e.stopPropagation();
    });
})(jQuery);