'use strict';
{
  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    console.log('Link was clicked!');
    console.log(event);

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }
    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');
    console.log('clickedElement', clickedElement);
    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');
    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }
    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    console.log(articleSelector);
    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    console.log(targetArticle);
    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };
  
  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author',
    optTagsListSelector = '.tags .list',
    optCloudClassCount = '5',
    optCloudClassPrefix = 'tag-size-';
  const generateTitleLinks = function(customSelector = ''){
    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    let html = '';
    for(let article of articles){
      /* get the article id */
      const articleId = article.getAttribute('id');
      /* find the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
      /* get the title from the title element & create HTML of the link */
      const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      /* insert link into titleList */
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
    const percentage = normalizedCount / normalizedMax
    const classNumber = Math.floor(percentage *(optCloudClassCount - 1) + 1);
    return optCloudClassPrefix + classNumber;
  };
  const generateTags = function(){
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};
    const articles = document.querySelectorAll(optArticleSelector);
    for(let article of articles){
      const tagsWrapper = article.querySelector(optArticleTagsSelector);
      /* make html variable with empty string */
      var html = '';
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      for(let tag of articleTagsArray){
        /* generate HTML of the link */
        const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
        /* add generated code to html variable */
        html = html + linkHTML;
        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags[tag]) {
          /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        }else{
          allTags[tag]++;
        }
      }
      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;
    }  
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector('.tags');

    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams)

    /* [NEW] create variable for all links HTML code */
    let allTagsHTML = '';

    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
      /* [NEW] generate code of a link and add it to allTagsHTML */
      const tagLinkHTML ='<li>' + '<a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '" >' +  tag + '</a></li>';
      console.log(tagLinkHTML);
      allTagsHTML += tagLinkHTML
    }
    /* [NEW] END LOOP: for each tag in allTags: */

    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = allTagsHTML; 
  }
  generateTags()

  const tagClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    for (let tagLink of tagLinks){
      tagLink.classList.remove('active');
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const targetTags = document.querySelectorAll('a[href="' + href + '"]');
    for(let targetTag of targetTags){
      targetTag.classList.add('active');
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }
  
  const addClickListenersToTags = function(){
    /* find all links to tags */
    const allLinksToTags = document.querySelectorAll('a[href^="#tag-"]');
    for (let link of allLinksToTags) {
      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', tagClickHandler);
    }
  };
  addClickListenersToTags();

  const generateAuthors = function(){
    const articles = document.querySelectorAll(optArticleSelector);
    for(let article of articles){
      /* find author wrapper */
      const authorList = article.querySelector(optArticleAuthorSelector);
      var html = '';
      /* get author from data-author attribute */
      const author = article.getAttribute('data-author');
      const authorLinkHTML = '<li><a href="#data-author ' + author + '">' + author + '</a></li>';
      html = html + authorLinkHTML;
      /* insert HTML of all the links into the tags wrapper */
      authorList.innerHTML = html;
    }
  };
  generateAuthors();

  const authorClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "author" and extract author from the "href" constant */
    const author = href.replace('#data-author ', '');
    /* find all authors links with class active */
    const authorLinks = document.querySelectorAll('a.active[href^="#data-author"]');
    for (let authorLink of authorLinks){
      /* remove class active */
      authorLink.classList.remove('active');
    }
    /* find all links with "href" attribute equal to the "href" constant */
    const targetAuthors = document.querySelectorAll('a[href="' + href + '"]');
    for(let targetAuthor of targetAuthors){
      //add class acitve//
      targetAuthor.classList.add('active');
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  }
  
  const addClickListenersToAuthors = function(){
    /* find all links to authors */
    const allLinksToAuthors = document.querySelectorAll('a[href^="#data-author"]');
    for (let link of allLinksToAuthors) {
      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', authorClickHandler);
    }
  };
  addClickListenersToAuthors();
}