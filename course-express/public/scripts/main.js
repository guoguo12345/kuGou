 //选项卡
 var mySwiper = new Swiper ('#section-container', {
    loop: true,
    onSlideChangeStart: function(swiper){
    	var index=swiper.activeIndex==6?0:swiper.activeIndex-1;
    	$('nav li').eq(index).addClass('active').siblings().removeClass();
    }
})        
 //点击切换页面
$('nav li').tap(function(){
//	console.log($(this).index());
    mySwiper.slideTo($(this).index()+1);
    $(this).addClass('active').siblings().removeClass();
});
//轮播图
var bannerSwiper = new Swiper ('#banner-container', {
    direction: 'vertical',
    loop: true,
    autoplay: 3000,
    // 如果需要分页器
    pagination: '.swiper-pagination',
}) 
