var HaxorNews = HaxorNews || {};

HaxorNews.ArticleList = {};

HaxorNews.ArticleList.init = function(){
	this.url = "http://haxor-news-json.herokuapp.com/";
	this.list = $('#article-list');

	this.getAll();
	$('#reload').click(HaxorNews.ArticleList.getAll);
	$('#new-article').submit(HaxorNews.ArticleList.addArticle);

}

HaxorNews.ArticleList.getAll = function(){
	$.ajax({
	  type: 'GET',
	  url: this.url + '/articles',
	  dataType: 'json',
	  data: { backdoor_user_id: 14 }
	})

	.done(function(response){
		HaxorNews.ArticleList.articleArray = response.articles;
	  console.log(response);
	  HaxorNews.ArticleList.renderAll(response.articles);

	});
};

HaxorNews.ArticleList.renderAll = function(array){
	error_div = $('#errors');
	error_div.removeClass('alert-danger');

	HaxorNews.ArticleList.list.empty();
	var i = 0,
			length = array.length;

	for (;i < length;){
		var article = new HaxorNews.Article(array[i]);
		this.list.append(article.render())
		i = i + 1;
	};

	$('.vote').click(HaxorNews.ArticleList.voteArticle);
};

HaxorNews.ArticleList.addArticle = function(event){
	var $form = $(event.target),
			$title = $form.find("input[name='title']"),
			$url = $form.find("input[name='url']");
	event.preventDefault();

	$.ajax({
		url: HaxorNews.ArticleList.url + '/articles',
		type: 'POST',
		dataType: 'json',
		data: {backdoor_user_id: 14, article: {title: $title.val(), url: $url.val()}},
	})

	.done(function(response) {
		console.log("success");
		console.log(response);
		$title.val('');
		$url.val('');

		var article = new HaxorNews.Article(response.article);
		HaxorNews.ArticleList.articleArray.push(article);
		HaxorNews.ArticleList.sortByScore(HaxorNews.ArticleList.articleArray);
		HaxorNews.ArticleList.renderAll(HaxorNews.ArticleList.articleArray);
	})

	.fail(function(response) {
		HaxorNews.ArticleList.displayErrors(response);
		console.log("error");
	})
};

HaxorNews.ArticleList.sortByScore = function(array){
	array.sort(function(a,b){
		return b.score - a.score;
	});
	return array;
};

HaxorNews.ArticleList.voteArticle = function(event){
	$target = $(event.target);
	direction = $target.attr('data-direction')
	article_id = $target.attr('id').split('article_').pop()
	var article = HaxorNews.ArticleList.findArticle(parseInt(article_id), HaxorNews.ArticleList.articleArray);

	$.ajax({
		url: HaxorNews.ArticleList.url + 'articles/' + article_id + '/vote',
		type: 'PATCH',
		dataType: 'json',
		data: {backdoor_user_id: 14, direction: direction}
	})
	.done(function(response) {
		console.log("success");
		console.log(response);
		article.current_vote = response.vote.direction;
		article.score = response.vote.votable_score;

		HaxorNews.ArticleList.sortByScore(HaxorNews.ArticleList.articleArray);
		HaxorNews.ArticleList.renderAll(HaxorNews.ArticleList.articleArray);

		console.log('new vote =' + article.current_vote)
	})
	.fail(function(response) {
		console.log("error");
		HaxorNews.ArticleList.displayErrors(response);
	})
	.always(function() {
		console.log("complete");
	});

};

HaxorNews.ArticleList.findArticle = function(id, array){
	var i = 0, length = array.length;

	for(;i < length;){
		if(array[i].id === id){
			return array[i];
		}
		i = i + 1;
	};
};

HaxorNews.ArticleList.displayErrors = function(response){
	var i = 0,
			errors = response.responseJSON.errors.url,
			length = errors.length,
			div = $('<div />'),
			error_div = $('#errors');
			debugger

	error_div.empty();
	error_div.addClass('alert alert-danger');

	for(;i < length;){
		div.append(errors[i]);
		i = i + 1;
	};

	errors = response.responseJSON.errors.title;
	length = errors.length;

	for(;i < length;){
		div.append(errors[i]);
		i = i + 1;
	};

	error_div.append(div);
}




