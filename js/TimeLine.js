function TimeLine(obj){


	/* ALIES */

	var self = this;


	/* PROPERTIES */

	this.propsObj = {
		scrollBln : false,
		arrowDownBln : true,
		parllaxEleCountNum : 10,
		parallaxNum : 0.9,
		transTimeNum : 1000,
		pointerNum : 0,
		currentPanelId : 0,
		parallaxOffsetNum : 50,
		debonceNum : 250,
		parallaxEleTopArr : [],
		triggerArr : [],
		stopHeightNum : undefined,
		contentHeightNum : undefined,
		contentWidthNum : undefined,
		initPointerHeightNum : undefined,
		initScrollNum : undefined,
		stopCountNum : undefined,
		lastPanelEq : undefined
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
  		$(".arrow").css("top",(this.propsObj.initPointerHeightNum-25)+"px");
  		$(".arrow").css("left",((this.propsObj.contentWidthNum-30)/2)+"px");
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
  		// get scrollPercent over tatal content height
    	var scrollPercent = (this.propsObj.pointerNum - this.propsObj.initPointerHeightNum) / (this.propsObj.contentHeightNum - this.propsObj.stopHeightNum);
    
	    // update all element y positon base on scrollPercent
	    $(".parallax .element").each(function(){
	    	var idStr = $(this).attr('id');
	    	var obj = {
	        			id : idStr,
	        			scrollNum : scrollPercent
	      			  };
	      	self.updateParaElement(obj);
	    });
  	};

  	this.updateParaElement = function(o){
  		var idNum = parseInt((o.id).replace("ele_", ""));
	    var pctNum = o.scrollNum;
	    var paraTop = this.propsObj.parallaxEleTopArr[idNum];
	    var mythNum = 0.6 + this.propsObj.parallaxEleTopArr.length/100;    
	    
	    var topNum = paraTop - (this.propsObj.contentHeightNum * pctNum * mythNum * this.propsObj.parallaxNum);
		// this one reflect the real number of elementCountNum on the screen, however, there are jumping frame when scroll start    
		//var topNum = Math.floor(this.propsObj.parallaxNum * (paraTop - (this.propsObj.contentHeightNum * pctNum * mythNum)));		    
	    $("#ele_" + idNum).css("top", topNum + "px");
  	};

	

    /* ARROW DIRECTION SECTION */

    this.getDirection = function(renderPointerNum){
    	if(renderPointerNum < this.propsObj.pointerNum){
      		this.propsObj.arrowDownBln = false;
    	}else{
      		this.propsObj.arrowDownBln = true;
   		}
    };

    this.setArrowDirection = function(){
    	if(this.propsObj.arrowDownBln){
	    	$(".arrow").removeClass("up");
	    }else{
	    	$(".arrow").addClass("up");
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

    this.initIntervalClutch = function(){
    	$(window).bind("scroll", function(){
			this.propsObj.scrollBln = true;
			clearTimeout($.data(this));
			$.data(this, setTimeout(function() {
				self.propsObj.scrollBln = false;
		    	}, self.propsObj.debonceNum)
			)
		});
    };

    this.renderFrame = function(){
    	var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    	var renderPointerNum = 	this.propsObj.initScrollNum + scrollTop;

    	this.getDirection(renderPointerNum);
		//update pointerNum
    	this.propsObj.pointerNum = renderPointerNum;

    	if(this.propsObj.scrollBln){
	      this.setArrowDirection();
	      this.matainState();
	      this.manageParallax();
	    }
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
		this.initIntervalClutch();
		this.addEvents();
		this.displayPanel(this.propsObj.currentPanelId);
    };


    /* ACTION SECTION */

    this.scrollNextStopDown = function(){
    	var panelEq = this.propsObj.lastPanelEq;
    	if(this.propsObj.currentPanelId !== -1){
    		panelEq = this.propsObj.currentPanelId+1;
    	}

    	if (panelEq == this.propsObj.lastPanelEq){
    		// disable downward arrow
    	}else {
    		$('html, body').stop().animate({'scrollTop': self.propsObj.triggerArr[panelEq]
	    	}, 900, 'swing');
    	} 
    	//console.log("currentPanelId => "+this.propsObj.currentPanelId + "  || "+this.propsObj.triggerArr[panelEq]);
    };


    /* EVENTS SECTION */

    this.addEvents = function(){
    	$(".arrow").bind("click", function(){
    		self.scrollNextStopDown();
    	});
    };

    this.removeEvents = function(){
    	$(window).unbind("scroll");
    	$(".arrow").unbind("click");
    };


    /* GARGABE COLLECTION SECTION */

    this.destory = function(){
        this.removeEvents();
        delete this;
    };


    /* CONSTRUCTOR */

    this.init(obj);
}
