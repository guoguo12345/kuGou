var myApp = angular.module('myApp',['ngRoute']);
myApp.config(['$routeProvider',function($routeProvider){
	$routeProvider
		.when('/main',{
			templateUrl: './scripts/tpls/main.html',
			controller: 'mainController'
		})
		.when('/search',{
			templateUrl: './scripts/tpls/search.html',
			controller: 'searchController'
		})
		//注册
		.when('/register',{
			templateUrl: './scripts/tpls/register.html',
			controller: 'registerController'
		})
		//登录
		.when('/login',{
			templateUrl: './scripts/tpls/login.html',
			controller: 'loginController'
		})
		//详情
		.when('/detail',{
			templateUrl: './scripts/tpls/detail.html',
			controller: 'detailController'
		})
		//列表点进去的详情
		.when('/main/:abc',{
			templateUrl: './scripts/tpls/detailsList.html',
			controller: 'detailsListController'
		})
		.otherwise({
			redirectTo: '/main'
		});

}]);
// 首页
myApp.controller('mainController',['$scope','$http',function($scope,$http){
	var phone = localStorage.getItem('phone');
	if(phone){
		$('header .login').html('注销');
		$('header .register').html('欢迎您,'+phone);
		$('header .register').attr('href','/#/main');
		$('header .login').tap(function(){
			localStorage.removeItem('phone');
			$('header .register').html('注册');
			$('header .login').html('登录');
			$('header .register').attr('href','/#/register');
		});
	}
	$http({
		url: './scripts/mock/list.json',
	 	method: 'get'
	})
	.then(function(res) {
			$scope.lists = res.data.data;
		},function(err) {
			// 请求失败执行代码
			console.log('error');
	})
	$scope.$on('$routeChangeSuccess',function(){
		//轮播图section
		var mySwiper = new Swiper ('#section-container', {
		    loop: true,
		    onSlideChangeStart: function(swiper){
		    	var index=swiper.activeIndex==6?0:swiper.activeIndex-1;
		    	$('nav li').eq(index).addClass('active').siblings().removeClass();
		    }
		});
		//点击切换页面
		$('nav li').tap(function(){
		//	console.log($(this).index());
		    mySwiper.slideTo($(this).index()+1);
		    $(this).addClass('active').siblings().removeClass();
		});    
		//轮播图banner
		var bannerSwiper = new Swiper ('#banner-container', {
		    direction: 'vertical',
		    loop: true,
		    autoplay: 3000,
		    autoplayDisableOnInteraction : false,
		    // 如果需要分页器
		    pagination: '.swiper-pagination',
		})    
	})
}]);
// 搜索页
myApp.controller('searchController',['$scope',function($scope){

}]);
// 注册
myApp.controller('registerController',['$scope','$http',function($scope,$http){
		$scope.register =function(){
			$http({
				url: '/users/register',
			 	method: 'post',
			 	data: {
			 		phone: $scope.phone,
			 		nickName: $scope.nickName,
			 		password: $scope.password
			 	}
			})
			.then(function(res) {
				$scope.data = res.data;
	//			console.log($scope.data);
					if($scope.data=='用户名不存在'){
						localStorage.setItem('phone',$scope.phone);
						location.href = '/#/main';
					}
				},function(error) {
					// 请求失败执行代码
					console.log('error');
			})
		}
}]);
// 登录
myApp.controller('loginController',['$scope','$http',function($scope,$http){
	$('.password').blur(function(){
		$http({
			url: '/users/login',
		 	method: 'post',
		 	data: {
		 		phone: $scope.phone,
		 		password: $scope.password
		 	}
		})
		.then(function(res) {
			$scope.data = res.data;
	//		console.log($scope.data);
			},function(error) {
				// 请求失败执行代码
				console.log('error');
		})
	})
	//存储手机号
	$scope.save = function(){
		$http({
			url: '/users/login',
		 	method: 'post',
		 	data: {
		 		phone: $scope.phone,
		 		password: $scope.password
		 	}
		})
		.then(function(res) {
			$scope.data = res.data;
			console.log($scope.data);
			if($scope.data=='密码正确'){
				localStorage.setItem('phone',$scope.phone);
				location.href = '/#/main';
			}
		},function(error) {
				// 请求失败执行代码
				console.log('error');
		})
		// var phone = localStorage.getItem('phone');
		// console.log(phone);
		// if(phone){
		// 	location.href = '/#/main';
		// }
		
	}
	
}]);
// 详情页
myApp.controller('detailController',['$scope',function($scope){
		//初始化播放列表隐藏
		$('.playList').hide();
		//点击播放列表显示 detail-bottom隐藏
		$('.detail .listBtn').on('click',function(){
			 $('.detail-bottom').hide();
			 $('.playList').show();
		});
		//点击播放列表隐藏
		$('.detail .close').on('click',function(){
			 $('.detail-bottom').show();
			 $('.playList').hide();
		});
		
		var isPlay = false;
		///
		var ado = document.getElementsByTagName('audio')[0];
		document.addEventListener('touchstart', function(){
			ado.play();
			ado.pause();
		}, false);
		//点击播放或暂停
		$('.playBtn').on('tap',function(){
			if(isPlay) {
				ado.pause();
				$(this).css({background: 'url(https://image.kuwo.cn/mpage/html5/2016/playbtn2.png) no-repeat center',backgroundSize:'90% 90%'});
				isPlay = false;
			}else {
				ado.play();
				$(this).css({background: 'url(http://image.kuwo.cn/mpage/html5/2016/pausebtn22.png) no-repeat center',backgroundSize:'90% 90%'});
				isPlay = true;
			}
		});
		 //播放总时间
		 var allTime;
		 $('audio').on('canplay',function(){
			allTime = Math.ceil(ado.duration);
			$('.allTime').html(allTime);
			 console.log(allTime);
			 //播放进度
			function playTime(){
				var currentTime = Math.ceil(ado.currentTime);
				$('.currentTime').html(currentTime);
				$('.innerRange').css({width:currentTime*100/allTime+'%'});
			}
			ado.addEventListener('timeupdate',playTime);
			//拖拽进度条
			// $('.playRange').on('touchstart',function(){
			// 	ado.removeEventListener('timeupdate',playTime);
			// 	var width = $(this).offsetX;
			// 	console.log(width);
			// });
		 });
}]);
//列表页点进去的详情页
myApp.controller('detailsListController',['$scope','$routeParams',function($scope,$routeParams){
	$scope.id = $routeParams.abc;
}]);