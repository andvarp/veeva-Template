/* main.js */


(function(){

	/**
	 * IVA
	 * @param {array}: Array of ISI elements to render
	 * @param {container}: Class of container to put the ISI
	 */
	var IVA = function(){
		this.modalClass = 'modal';
		this.modalCaller = 'open-modal';
	};

	IVA.prototype = {
		/**
         * Function to add active class for active menus
         *
         * @param {menu} menu item to add class
         * @param {submenu} submenu item class
         */
		addActiveMenuAndSubMenu : function(menu, submenu){
			$('#'+menu).addClass('active');
			$('#'+submenu).addClass('active');
		},

		/**
         * Function to create popup from default value
         *
         * @param {widtH} width from popup
         * @param {height} height from popup
         */
		createPopup : function(width,height){
			var self = this;
			$('.'+self.modalCaller).colorbox({inline:true, width:width+'%', height:'670px'});
		},

		/**
         * Function to create popup from custom values
         *
         * @param {widtH} width from popup
         * @param {height} height from popup
         * @param {pickedObject} object to add colorbox plugin
         */
		createMultiplePopup : function(width,height,pickedObject){
			var self = this;
			var object = this.modal_caller;
			if(pickedObject != 'undefined'){
				object = pickedObject;
			}
			$('.'+object).colorbox({inline:true, width:width+'%', height:'670px'});
		}

	};

	//Export or use globally.
	window.IVA = IVA || {};

})();

$(document).ready(function() {

	// use $(document).on('click'... instead of .click() because some goto links are added with Ajax
	$(document).on('click', '.gotoslide', function() {
		//console.log(this.dataset.gotoslide);
		// get the slide id from the data-gotoslide attribute
		if (this.dataset.gotoslide !== undefined) {
	  		DHVU.goToSlide(this.dataset.gotoslide);
	  	}
	 });

	$('.continue-button').click(function() {
		com.veeva.clm.nextSlide();
	});

	// use FastClick to remove the 300ms delay on tapping links
	FastClick.attach(document.body);

	// fix the issue where the whole page will scroll and bounce when you scroll past the end of a scrollable element
	bouncefix.add('scrollable');

	// Prevent slides from scrolling vertically if you swipe up or down. Allow vertical scrolling only on elements that
	// have the "scrollable" class.
	$('body').on('touchmove', function (e) {
		if (!$('.scrollable').has($(e.target)).length) {
			e.preventDefault();
		}
	});

});

