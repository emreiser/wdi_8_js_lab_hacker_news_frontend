var HaxorNews = HaxorNews || {};

HaxorNews.Article = function(article){
	this.id = article.id;
	this.title = article.title;
	this.url = article.url;
	this.comments_count = article.comments_count;
	this.score = article.score;
	this.user_email = article.user_email;
	this.current_vote = article.current_vote;
}

HaxorNews.Article.prototype.render = function(){
	var li = $('<li />'),
			h4 = $('<h4 />');
			ul = $('<ul />')
			title_link = $('<a />',{
				href: this.url,
				text: this.title,
				target: '_blank'
			}),
			comment_link = $('<a />',{
				href: "http://haxor-news-json.herokuapp.com/articles/" + this.id + "/comments",
				text: this.comments_count + ' comments'
			}),
			upvote_link = $('<a />',{
				href: '#',
				text: 'upvote',
				id: 'up_article_'+ this.id,
				'data-direction': 'up'
			}),

			downvote_link = $('<a />',{
				href: '#',
				text: 'downvote',
				id: 'down_article_'+ this.id,
				'data-direction': 'down'
			}),

			comment_li = $('<li />'),
			upvote_li = $('<li />'),
			downvote_li = $('<li />');

	comment_li.append(comment_link);
	upvote_li.append(upvote_link);
	upvote_link.addClass('vote');
	downvote_li.append(downvote_link);
	downvote_link.addClass('vote');

	if(this.current_vote === "up"){
		upvote_link.addClass('bold');
		upvote_link[0].setAttribute('datadirection', 'neutral')

	} else if(this.current_vote === "down") {
		downvote_link.addClass('bold');
		downvote_link[0].setAttribute('datadirection', 'neutral')
	};

	ul.addClass('sub-list');
	ul.append('<li>' + this.score + ' points</li>');
	ul.append('<li>by ' + this.user_email + '</li>');
	ul.append(comment_li);
	ul.append(upvote_li);
	ul.append(downvote_li);

	h4.append(title_link);
	li.append(h4);

	li.append(ul);
	li.id = 'article_' + this.id;

	return li;

};