// mBox
// mBox is a js lib for making pop-up modalesque windows. not for slide shows.

function mBox_trigger(key) {
	mBox({
		overlay_opacity:0.5,
		overlay_color:'olive',
		content:'/account/login/section/ajax',
		mBox_width: '500px',
		mBox_class: 'mBox_login'
	});
}

var mBox = {

	user_default_options: {},

	default_options: {
		overlay_omit: false,
		overlay_click_closes: true,
		overlay_opacity: 0.8,
		overlay_color: 'black', // set this to an empty string to govern it by a css setting
		mBox_width: 500,
		mBox_class: 'mBox_standard',
		zIndex_base: 100,
		overlay_fade_in_length: 2000,
		container_fade_in_length: 6000,
		content: "who is number 1?",
		dismiss_button_text: '', // leave empty to omit
		affirm_button: {
			text: 'Okay',
			callback: function() { alert('oink');}
		},
		misc_buttons: [{
			text: 'Other',
			callback: function() { alert('moo');}
		},{
			text: 'fuck',
			callback: function() { alert('shit');}
		}]
	},

	set_default_options: function(options) {
		this.user_default_options = options;
	},

	get_options: function() {
		var options = this.default_options;
		for(x in this.user_default_options) {
			options[x] = this.user_default_options[x];
		}
		return options;
	},

	jog_boxes: function(seen) {
		if(typeof seen != 'boolean') seen = true;
		var box = $('.mBox');
		//var newLeft = box.width()/-2 + 'px';
		var newTop = box.height()/-2 + 'px'
		box.each(function(){
			if(seen) {
				//$(this).animate({marginLeft:newLeft}, 1000);
				$(this).animate({marginTop:newTop}, 1000);
			} else {
				//$(this).css('margin-left', newLeft);
				$(this).css('margin-top', newTop);
			}
		});
	},

	close: function(all) {
		// if there is only one, then it is all by default
		if($(".mBox").length == 1) all = 'all';
		if(typeof all != 'undefined' && all == 'all') {
			// close/animate.remove all elements with this mbox index
			$("#mBox_overlay").stop().animate({opacity:0}, 500, function(){$(this).remove()});
			$(".mBox").stop().animate({opacity:0}, 1000, function(){$(this).remove()});
		} else {
			//close jsut one. well, there should only be one that the user can see, so grab the 'last' one?
			$(".mBox").last().stop().animate({opacity:0}, 1000, function(){$(this).remove()});
			// move the overlay back down one chunk
			var overlay = $("#mBox_overlay");
			overlay.css('zIndex', overlay.css('zIndex') - 5);
		}
	},

	open: function(argument_options) {
		var options = this.get_options();

		for(x in options) options[x] = argument_options[x] || options[x];

		console.log('openwith these options');
		console.log(options);
		

		// count how many we already have
		var mBox_index = parseInt($(".mBox").length);

		console.log('we have ' + mBox_index + " mboxes already");
		// this determines our z-indexes
		var overlay_zIndex = options.zIndex_base + (mBox_index * 5);
		var container_zIndex = overlay_zIndex + 1;

		// create the overlay... or move it 'up' if it already exists
		if( ! options.overlay_omit) {
			var mBox_overlay = $("#mBox_overlay");
			if(mBox_overlay.length == 0) {
				// create one
				var background_color_fragment = "";
				if(options.overlay_color.length) background_color_fragment = "background-color:" + options.overlay_color + "; "
				var overlay = $('<div id="mBox_overlay" style="' + background_color_fragment + '"></div>');
				if(options.overlay_click_closes) {
					overlay.click(function(){
						mBox.close('all');
					});
				}
				// set the zindex
				mBox_overlay.css('zIndex', overlay_zIndex);
				$('body').append(overlay);
				overlay.animate({opacity:options.overlay_opacity}, options.overlay_fade_in_length);
			} else {
				// have one already, move it up:
				mBox_overlay.css('zIndex', overlay_zIndex);
			}
		}


		// create the mBox
		var mBox_container = $('<div class="mBox ' + options.mBox_class + '" style="width:' + options.mBox_width + 'px; margin-left:' + options.mBox_width/-2 + 'px; z-index: ' + container_zIndex + '; opacity:0;"><div class="content"></div></div>');

		// is there an affirm button? prep it.
		if(typeof options.affirm_button == 'object') {
			var affirm_button = $('<button type="button" style="float:right; margin-left:20px;"></button>');
			affirm_button.html(options.affirm_button.text);
			affirm_button.click(options.affirm_button.callback);
			mBox_container.append(affirm_button);
		}
		
		// is there a dismiss button? prep it.
		if(options.dismiss_button_text.length) {
			var dismiss_button = $('<button type="button" style="float:right; margin-left:20px;"></button>');
			dismiss_button.html(options.dismiss_button_text);
			dismiss_button.click(function(){
				mBox.close();
			});
			mBox_container.append(dismiss_button);
		}

		// are there any misc buttons?
		if(typeof options.misc_buttons == 'array') {
			for(x=0; x<=options.misc_buttons.length; x++) {
				var misc_button = $('<button type="button" style="float:right; margin-left:20px;"></button>');
				misc_button.html(options.misc_buttons[x].dismiss_button_text);
				misc_button.click(options.misc_buttons[x].callback);
				mBox_container.append(misc_button);
			}
		}

		$('body').append(mBox_container);

		// contents of it.
		if(options.content.length && options.content.substr(0,1) == '/') {
			// go get it
			oink = this;
			mBox_container.find(".content").load(options.content, function(){
				oink.jog_boxes(false);
				mBox_container.animate({opacity:100}, options.container_fade_in_length);
			});
		} else {
			mBox_container.find(".content").html(options.content);
			this.jog_boxes(false);
			mBox_container.animate({opacity:100}, options.container_fade_in_length);
		}


	}

}



