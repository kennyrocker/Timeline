function TimeLine(obj){


	/* ALIES */

	var self = this;


	var parallaxEle = document.querySelector('.parallax');

	/* PROPERTIES */

	this.propsObj = {
		parllaxEleCountNum : 10,
		parallaxNum : 0.7,
		transTimeNum : 1000,
		pointerNum : 0,
		currentPanelId : 0,
		parallaxOffsetNum : 50,
		resizeTimeout : false,
		resizeDelta : 200,
		parallaxEleTopArr : [],
		triggerArr : [],
		stopHeightNum : undefined,
		contentHeightNum : undefined,
		contentWidthNum : undefined,
		initPointerHeightNum : undefined,
		initScrollNum : undefined,
		stopCountNum : undefined,
		lastPanelEq : undefined,
		compareTime : undefined
	};



	/* SET UP */

	this.setProps = function(){
		this.propsObj.stopHeightNum = $(".stop").eq(0).height();
		this.propsObj.contentHeightNum = $(".content").height();
		this.propsObj.contentWidthNum = $(".content").width();
		this.propsObj.initPointerHeightNum = this.propsObj.stopHeightNum/2;
		this.propsObj.initScrollNum = this.propsObj.stopHeightNum/2;
		this.propsObj.stopCountNum = $(".stop").size();
		this.propsObj.lastPanelEq = this.propsObj.stopCountNum - 1;
	};

	this.drawStage = function(){
		// set init pointer height & arrow position
  		$(".pointer").css("height",(this.propsObj.initPointerHeightNum-13)+"px");

  		$(".cycle").css("top",(this.propsObj.initPointerHeightNum-35)+"px");
  		$(".cycle").css("left",((this.propsObj.contentWidthNum-70)/2)+"px");
  		// set init mark's position
  		$(".mark").css("margin-top",(this.propsObj.initPointerHeightNum)+"px");
	};

	this.setTriggers = function(){
		$(".stop").each(function(){
    		var top = $(this).position().top;
    		self.propsObj.triggerArr.push(top);
  		});
	};



	/* PARALLAX SECTION */

	this.drawParallax = function(){
		this.drawParallaxElements(this.propsObj.parllaxEleCountNum);
		this.initParallaxEleTopArr();
		var maxWidthNum = this.propsObj.contentWidthNum - ($(".element").eq(0).width()); 
      	var i = 0;
      	$(".parallax .element").each(function(){
        	$(this).css("left", (self.getRandomInt(0,maxWidthNum))+"px");  
        	$(this).css("top", (self.propsObj.parallaxEleTopArr[i])+"px");
        	i++; 
      	});
	};

	this.drawParallaxElements = function(countNum){
		var tplStr = "";
	    for(var i=0;i<countNum;i++){
	    	tplStr += "<div id='ele_"+i+"' class='element'></div>";
	    }
	    $(".parallax").html(tplStr);
	};

	this.initParallaxEleTopArr = function(){
	    var baseStopNum = this.propsObj.contentHeightNum/this.propsObj.parllaxEleCountNum;
	    var offsetNum = this.propsObj.parallaxOffsetNum;
	    for(var i=0; i<this.propsObj.parllaxEleCountNum; i++){
	      var randomTop = Math.floor(this.getRandomInt((baseStopNum*i),((baseStopNum*i)+offsetNum)));
	      this.propsObj.parallaxEleTopArr.push(randomTop);
	    }
	};

	this.manageParallax = function(){
  		
  		var scrollTop = this.propsObj.pointerNum;
  		var fullHeight = this.propsObj.contentHeightNum;
  		var initPointerHeightNum = this.propsObj.initPointerHeightNum;
  		var parallaxTop =  0 - (scrollTop - initPointerHeightNum) * this.propsObj.parallaxNum;

  		parallaxEle.style.top = parallaxTop+"px";
  		//parallaxEle.style.webkitTransform = "translate(0,"+parallaxTop+"px)";
  	};

    this.manageControl = function(){
    	if(this.propsObj.currentPanelId == 0){
    		$('.arrow.up').fadeOut(this.propsObj.transTimeNum/2);
    	}else if(this.propsObj.currentPanelId == -1){
    		$('.arrow.down').fadeOut(this.propsObj.transTimeNum/2);
    	}else{
    		$('.arrow.down, .arrow.up').show();
    	}
    };



    /* PANEL SECTION */

    this.matainState = function(){
    	var pointerNum = this.propsObj.pointerNum;
    	var triggerArr = this.propsObj.triggerArr;
    	var lastPanelEq = this.propsObj.lastPanelEq;

    	if(pointerNum > 0 && pointerNum < triggerArr[1]){
	    	this.managePanel(0);
	    	this.propsObj.currentPanelId = 0;
	    }else if(pointerNum > triggerArr[lastPanelEq]){
	    	this.managePanel(-1);
	    	this.propsObj.currentPanelId = -1;
	    }else{ 
	    	var i; 
	    	for(i= 1; i<lastPanelEq; i++){
	        	if(pointerNum > triggerArr[i] && pointerNum < triggerArr[(i+1)]){
	            	this.managePanel(i);
	            	this.propsObj.currentPanelId = i;
	        	}
	      	}
	    }
    };

    this.managePanel = function(panelId){
    	if(this.propsObj.currentPanelId !== panelId){
	    	this.displayPanel(panelId);
	    }
    };

    this.displayPanel = function(panelId){
	    if( panelId == -1 ){
	      panelId = this.propsObj.lastPanelEq;
	    }
	    $(".stop .info").fadeOut(this.propsObj.transTimeNum);
	    $(".stop .info").eq(panelId).fadeIn(this.propsObj.transTimeNum);
  	};



  	/* ANIMATION SECTION */
    this.initInterval = function(){
    	// animate engine
  		window.requestAnimFrame = (function(){
  			return  window.requestAnimationFrame       ||
          			window.webkitRequestAnimationFrame ||
          			window.mozRequestAnimationFrame    ||
          			function( callback ){
            			window.setTimeout(callback, 1000 / 60);
          			};
  		})();
  		// start animate
  		(function animloop(){
    		requestAnimFrame(animloop);
    		self.renderFrame();
  		})();
    };

    this.renderFrame = function(){
    	var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    	var renderPointerNum = 	this.propsObj.initScrollNum + scrollTop;
		//update pointerNum
    	this.propsObj.pointerNum = renderPointerNum;
		this.matainState();
	    this.manageParallax();
	    this.manageControl();
    };



    /*  UITIL */
    this.getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
    };



    /* INITILZATION */

    this.init = function(obj){
    	// make stop height the full height of the browser
    	$(".stop").css("height", $(window).height()+"px");
		this.setProps();
		this.drawStage();
		this.setTriggers();
		this.drawParallax();
		this.initInterval();
		this.addEvents();
		this.displayPanel(this.propsObj.currentPanelId);
    };



    /* ACTION SECTION */

    this.scrollNextStop = function(){
    	var panelEq;
    	if(this.propsObj.currentPanelId !== -1){
    		panelEq = this.propsObj.currentPanelId + 1;
    	}else{
    		panelEq = this.propsObj.lastPanelEq + 1;
    	}

    	if (panelEq <= this.propsObj.lastPanelEq){
    		$('html, body').stop().animate({'scrollTop': self.propsObj.triggerArr[panelEq]
	    	}, self.propsObj.transTimeNum, 'swing');
    	}
    };

    this.scrollPreviusStop = function(){
    	var panelEq;
    	if(this.propsObj.currentPanelId == -1){
    		panelEq = this.propsObj.lastPanelEq - 1;
    	}else{
    		panelEq = this.propsObj.currentPanelId - 1;
    	}

    	if (panelEq >= 0){
    		$('html, body').stop().animate({'scrollTop': self.propsObj.triggerArr[panelEq]
	    	}, self.propsObj.transTimeNum, 'swing');
    	}
    };



    /* REZIE BROWSER SECTION */

    this.resizeEnd = function(){
    	if (new Date() - this.propsObj.compareTime < this.propsObj.resizeDelta) {
			setTimeout(self.resizeEnd, self.propsObj.resizeDelta);
		} else {
		    this.propsObj.resizeTimeout = false;
		    self.reInit();
		} 
    };

    this.reInit = function(){
		this.propsObj.triggerArr = [];
		$(".stop").css("height", $(window).height()+"px");
		this.setProps();
		this.drawStage();
		this.setTriggers();
    };



    /* EVENTS SECTION */

    this.addEvents = function(){
    	$(".arrow.down").bind("click", function(){
    		self.scrollNextStop();
    	});
    	$(".arrow.up").bind("click", function(){
    		self.scrollPreviusStop();
    	});
		$(window).resize(function() {
		    self.propsObj.compareTime = new Date();
		    if (self.propsObj.resizeTimeout === false) {
		        self.propsObj.resizeTimeout = true;
		        setTimeout(self.resizeEnd, self.propsObj.resizeDelta);
		    }
		});
    };

    this.removeEvents = function(){
    	$(".arrow.down").unbind("click");
    	$(".arrow.up").unbind("click");
    };



    /* GARGABE COLLECTION SECTION */

    this.destory = function(){
        this.removeEvents();
        delete this;
    };



    /* CONSTRUCTOR */

    this.init(obj);
}
