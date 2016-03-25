	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$sidebar = $('#sidebar');

		// Sidebar
			if ($sidebar.length > 0) {

				var $sidebar_a = $sidebar.find('a');

				//Removes all the classes, this prevents that highlight bug from moccuring, but deselects the current one, this SOHULDNT be an issue later
				$sidebar_a.removeClass();

				$sidebar_a
					.addClass('scrolly')
					.on('click', function() {

						var $this = $(this);
						console.log("An Element was clicked!");
						// External link? Bail.
							if ($this.attr('href').charAt(0) != '#')
								return;

						// Deactivate all links.
							$sidebar_a.removeClass('active');

						// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
							$this
								.addClass('active')
								.addClass('active-locked');

					})
					.each(function() {

						var	$this = $(this),
							id = $this.attr('href'),
							$section = $(id);

						// No section for this link? Bail.
							if ($section.length < 1)
								return;

						// Scrollex.
							$section.scrollex({
								mode: 'middle',
								top: '-20vh',
								bottom: '-20vh',
								initialize: function() {

									// Deactivate section.
										if (skel.canUse('transition'))
											$section.addClass('inactive');

								},
								enter: function() {
									console.log('Entered');

									// Activate section.
									$section.removeClass('inactive');
									$this.removeClass('active');

									// No locked links? Deactivate all links and activate this section's one.
										if ($sidebar_a.filter('.active-locked').length == 0) {
											console.log('No Locked links. All links deactivated and this one activated');
											$sidebar_a.removeClass('active');
											$this.addClass('active');

										}

									// Otherwise, if this section's link is the one that's locked, unlock it.
										else if ($this.hasClass('active-locked'))
											$sidebar_a.removeClass('active');
											$this.removeClass('active-locked');
											$this.addClass('active');

								}
							});

					});

			}

		// Scrolly.
			$('.scrolly').scrolly({
				speed: 1500,
				offset: function() {

					// If <=large, >small, and sidebar is present, use its height as the offset.
						if (skel.breakpoint('large').active
						&&	!skel.breakpoint('small').active
						&&	$sidebar.length > 0)
							return $sidebar.height();

					return 0;

				}
			});


		// Features.
			if (skel.canUse('transition'))
				$('.features')
					.scrollex({
						mode: 'middle',
						top: '-20vh',
						bottom: '-20vh',
						initialize: function() {

							// Deactivate section.
								$(this).addClass('inactive');

						},
						enter: function() {
							console.log($this);

							// Activate section.
								$(this).removeClass('inactive');

						}
					});

	});
