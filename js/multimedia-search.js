function executeSearch(){
	$(document).ready(function(){
		try{

			if ($('#searchTerm').val() === ""){
				alert("Please enter a search term.");
			}
			else{				
				if ($('input[name=searchService]:checked').val() === "Both"){
					searchiTunes();
					searchYouTube();			
				}
				else if	($('input[name=searchService]:checked').val() === "iTunes"){
					hideYouTube();
					searchiTunes();
				}
				else{
					hideiTunes();
					searchYouTube();
				}
			}
		}
		catch(err){
			console.log(err);
		}
	});
}


function searchiTunes(){
	try{

		$('#searchButton').val("Loading ...");
		$('#searchButton').prop('disabled', true);	 

		$.getJSON('https://itunes.apple.com/search?term='+formatCriteria($('#searchTerm').val())+'&media=music&limit=50&callback=?', 
		  	function(data) {
				var songs = "";


				$.each(data.results, function(index,song){
					var displayItem = '<div class="row">';
					displayItem += '<div class="col-sm-3"><center>';
					displayItem += '<img class="img-thumbnail" src="' + song.artworkUrl100 + '">';
					displayItem += '</center></div>';
					displayItem += '<div class="col-sm-2"><center>';
					displayItem += '<h5>' + song.trackName + '</h5>';
					displayItem += '<h5>'+ song.artistName +'</h5>';
					displayItem += '<p>'+ song.collectionName;
					displayItem += '</center></div>';
					displayItem += '<div class="col-sm-2"><center>';			
					displayItem += '<p>Collection Price: ' + song.collectionPrice;
					displayItem += '<br>Track Price: ' + song.trackPrice + '</p></center></div>';
					displayItem += '<div class="col-sm-5"><center>';
					displayItem += '<audio controls><source src="'+ song.previewUrl + '" type="audio/mpeg">';
					displayItem += 'Your browser does not support the audio element.</audio>';
					displayItem += '</center></div>'
					displayItem += '<div class="col-sm-12"><hr></div></div>';
					songs += displayItem;

				});

	            if(data.resultCount === 0)
	            {
	            	$('#iTunesHeadline').hide();
	            	$('#iTunesPagination').hide();
	            	$('#iTunesResults').show();
					var noResultsMessage = "No items found in the iTunes library for " + $('#searchTerm').val();
					$('#iTunesResults').html('<div class="col-md-12"><center><h4>' + noResultsMessage + '</h4></center></div>');

	            }
	            else{
					showiTunes();
	            	$('#iTunesResults').html(songs);

		            //jPages
		            $(function() {
						$("#iTunesPagination").jPages({
							containerID: "iTunesResults"
						});
					});				
	            }
	            $('#searchButton').val("Search");
				$('#searchButton').prop('disabled', false);	 
        	});
	}
	catch (err){
		console.log(err);
	}
}

function searchYouTube(){
	try{
		$('#searchButton').val("Loading ...");
		$('#searchButton').prop('disabled', true);

		$.ajax({
			url: 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&order=relevance&q='+formatCriteria($('#searchTerm').val())+'&key=AIzaSyC9IcvsoIFHxGEkRcgGZWx48gDKmTe7muQ',
			dataType: 'json',
			type: 'GET',
			success: function(data) {
				var videos = '';
				$.each(data.items, function(index, video){
				var displayItem = '<div class="row">';
				displayItem += '<div class="col-sm-6"><center>';
				displayItem += '<img class="img-thumbnail" src="' + video.snippet.thumbnails.default.url + '">';
				//displayItem += '<iframe width="300" height="120" src="https://www.youtube.com/embed/' + video.id.videoId + '"></iframe>';
				displayItem += '</center></div>';
				displayItem += '<div class="col-sm-6"><center>';
				displayItem += '<h5><a href="https://www.youtube.com/watch?v=' + video.id.videoId + '" target="_blank">Watch: ' + video.snippet.title +'</a></h5>';
				displayItem += '</center></div>';
				displayItem += '<div class="col-sm-12"><hr></div></div>';
				videos += displayItem;
				});

				if(data.items.length === 0){
					$('#YouTubeHeadline').hide();
					$('#YouTubePagination').hide();
					$('#YouTubeResults').show();

					var noResultsMessage = "No items found in the YouTube library for " + $('#searchTerm').val();

					$('#YouTubeResults').html('<div class="col-md-12"><center><h4>' + noResultsMessage + '</h4></center></div>');
				}
				else{
					showYouTube();
					$('#YouTubeResults').html(videos);

					//jPages
					$(function() {
						$("#YouTubePagination").jPages({
							containerID: "YouTubeResults"
						});
					});
				}
			}

	    });
		
		$('#searchButton').val("Search");
		$('#searchButton').prop('disabled', false);	    

	}
	catch(err){
		console.log(err);
	}
}

function hideYouTube(){
	try {
		$('#YouTubeHeadline').hide();
		$('#YouTubeResults').hide();
		$('#YouTubePagination').hide();
	}
	catch(err)
	{
		console.log(err);
	}
}

function hideiTunes(){
	try{
		$('#iTunesHeadline').hide();
		$('#iTunesResults').hide();
		$('#iTunesPagination').hide();
	}
	catch(err)
	{
		console.log(err);
	}
}

function showYouTube(){
	try{
		$('#YouTubeHeadline').html('<div class="col-sm-12"><h1>YouTube</h1></div>');
		$('#YouTubeHeadline').show();
		$('#YouTubeResults').show();
		$('#YouTubePagination').show();
	}
	catch(err)
	{
		console.log(err);
	}
}

function showiTunes(){
	try{
		$('#iTunesHeadline').html('<div class="col-sm-12"><h1>iTunes</h1></div>');
		$('#iTunesHeadline').show();
		$('#iTunesResults').show();
		$('#iTunesPagination').show();
	}
	catch(err)
	{
		console.log(err);
	}
}

function formatCriteria(criteria){
	return criteria.trim().replace(/ /g, "+");
}