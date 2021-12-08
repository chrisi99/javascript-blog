'use strict';
{
  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
  }

  const opt = {
    articleSelector: '.post',
    titleSelector: '.post-title',
    titleListSelector: '.titles',
    articleTagsSelector: '.post-tags .list',
    articleAuthorSelector: '.post-author',
    tagsListSelector: '.tags .list',
    cloudClassCount: '5',
    cloudClassPrefix: 'tag-size-',
    active: 'active',
    href: 'href'
  };

  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    const activeLinks = document.querySelectorAll('.titles a.active');
    
    for(let activeLink of activeLinks){
      activeLink.classList.remove(opt.active);
    }

    clickedElement.classList.add(opt.active);
    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles){
      activeArticle.classList.remove(opt.active);
    }

    const articleSelector = clickedElement.getAttribute(opt.href);
    const targetArticle = document.querySelector(articleSelector);
    targetArticle.classList.add(opt.active);
  };
  
  const generateTitleLinks = function(customSelector = ''){
    const titleList = document.querySelector(opt.titleListSelector);
    titleList.innerHTML = '';
    const articles = document.querySelectorAll(opt.articleSelector + customSelector);
    let html = '';

    for(let article of articles){
      const articleId = article.getAttribute('id');
      const articleTitle = article.querySelector(opt.titleSelector).innerHTML;
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);
      html = html + linkHTML;
    }

    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');

    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  };

  generateTitleLinks();

  const calculateTagsParams = function(tags){
    const params = {
      max: 0,
      min: 999999
    };

    for(let tag in tags){
      params.max = Math.max(tags[tag], params.max);
      params.min = Math.min(tags[tag], params.min);
    }

    return params;
  };

  const calculateTagClass = function(count, params){
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage *(opt.cloudClassCount - 1) + 1);

    return opt.cloudClassPrefix + classNumber;
  };

  const generateTags = function(){
    let allTags = {};
    const articles = document.querySelectorAll(opt.articleSelector);

    for(let article of articles){
      const tagsWrapper = article.querySelector(opt.articleTagsSelector);
      let html = '';
      const articleTags = article.getAttribute('data-tags');
      const articleTagsArray = articleTags.split(' ');

      for(let tag of articleTagsArray){
        const linkHTMLData = {id: tag, title: tag};
        const linkHTML = templates.tagLink(linkHTMLData);
        html = html + linkHTML;

        if(!allTags[tag]) {
          allTags[tag] = 1;
        }else{
          allTags[tag]++;
        }
      }

      tagsWrapper.innerHTML = html;
    }  

    const tagList = document.querySelector('.tags');
    const tagsParams = calculateTagsParams(allTags);
    const allTagsData = {tags: []};

    for(let tag in allTags){
      const tagLinkHTML = templates.tagCloudLink;
      console.log(tagLinkHTML);
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }

    tagList.innerHTML = templates.tagCloudLink(allTagsData); 
  };

  const tagClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute(opt.href);
    const tag = href.replace('#tag-', '');
    const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

    for (let tagLink of tagLinks){
      tagLink.classList.remove(opt.active);
    }

    const targetTags = document.querySelectorAll('a[href="' + href + '"]');

    for(let targetTag of targetTags){
      targetTag.classList.add(opt.active);
    }

    generateTitleLinks('[data-tags~="' + tag + '"]');
  };
  
  const addClickListenersToTags = function(){
    const allLinksToTags = document.querySelectorAll('a[href^="#tag-"]');

    for (let link of allLinksToTags) {
      link.addEventListener('click', tagClickHandler);
    }
  };

  const generateAuthors = function(){
    let allAuthors = {};
    const articles = document.querySelectorAll(opt.articleSelector);

    for(let article of articles){
      const authorList = article.querySelector(opt.articleAuthorSelector);
      let html = '';
      const author = article.getAttribute('data-author');
      const linkHTMLData = {id: author, title: author};
      const linkHTML = templates.authorLink(linkHTMLData);
      html = linkHTML;
      authorList.innerHTML = html;

      if(!allAuthors[author]) {
        allAuthors[author] = 1;
      }else{
        allAuthors[author]++;
      }
    }

    const authorsList = document.querySelector('.authors');
    const authorsParams = calculateTagsParams(allAuthors);
    const allAuthorsData = {authors: []};

    for(let author in allAuthors){
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
        className: calculateTagClass(allAuthors[author], authorsParams)
      });
    }

    authorsList.innerHTML = templates.authorCloudLink(allAuthorsData); 
  };

  const authorClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute(opt.href);
    const author = href.replace('#data-author', '');
    const authorLinks = document.querySelectorAll('a.active[href^="#data-author"]');

    for (let authorLink of authorLinks){
      authorLink.classList.remove(opt.active);
    }

    const targetAuthors = document.querySelectorAll('a[href="' + href + '"]');

    for(let targetAuthor of targetAuthors){
      targetAuthor.classList.add(opt.active);
    }

    generateTitleLinks('[data-author="' + author + '"]');
  };
  
  const addClickListenersToAuthors = function(){
    const allLinksToAuthors = document.querySelectorAll('a[href^="#data-author"]');

    for (let link of allLinksToAuthors) {
      link.addEventListener('click', authorClickHandler);
    }
  };

  addClickListenersToAuthors();
  generateTitleLinks();
  generateTags();
  addClickListenersToTags();
  generateAuthors();
  addClickListenersToAuthors();
}