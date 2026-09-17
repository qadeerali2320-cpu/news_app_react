import React, {
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react';

import NewsItem from './NewsItem';
import './NewsCSS.css';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';


const News = (props) => {

  // ==========================================
  // STATE
  // ==========================================

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  /*
    This stores every article that has already
    been accepted.

    It is important that this is a REF instead
    of state because we need to check duplicates
    across multiple API pages.
  */
  const seenArticlesRef = useRef([]);

  /*
    Prevents duplicate initial requests,
    especially during React StrictMode development.
  */
  const categoryRequestRef = useRef(null);


  // ==========================================
  // CAPITALIZE FIRST CHARACTER
  // ==========================================

  const capitalizeFirstCharacter = (string) => {

    if (!string) return '';

    return (
      string.charAt(0).toUpperCase() +
      string.slice(1)
    );
  };


  // ==========================================
  // PAGE TITLE
  // ==========================================

  useEffect(() => {

    document.title =
      `${capitalizeFirstCharacter(props.category)} -QdPiNews`;

  }, [props.category]);


  // ==========================================
  // FILTER 1:
  // CHECK WHETHER ARTICLE IS FROM TODAY
  // ==========================================

  const isToday = (pubDate) => {

    if (!pubDate) {
      return false;
    }

    const newsDate = new Date(pubDate);

    if (isNaN(newsDate.getTime())) {
      return false;
    }

    /*
      We compare both dates in Pakistan time.

      Example:

      Current Pakistan date:
      2026-09-03

      Article:
      2026-09-03T06:30:00Z

      It will be converted to Pakistan time before
      comparing the date.
    */

    const pakistanDateOptions = {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };

    const todayPakistan = new Intl.DateTimeFormat(
      'en-CA',
      pakistanDateOptions
    ).format(new Date());


    const newsDatePakistan = new Intl.DateTimeFormat(
      'en-CA',
      pakistanDateOptions
    ).format(newsDate);


    return todayPakistan === newsDatePakistan;
  };


  // ==========================================
  // NORMALIZE TEXT
  // ==========================================

  const normalizeText = (text) => {

    if (!text) {
      return '';
    }

    return text
      .toLowerCase()

      // Remove URLs
      .replace(/https?:\/\/\S+/g, '')

      // Replace punctuation with spaces
      .replace(/[^\w\s]/g, ' ')

      // Remove extra spaces
      .replace(/\s+/g, ' ')

      .trim();
  };


  // ==========================================
  // STOP WORDS
  // ==========================================

  const stopWords = new Set([

    'the',
    'a',
    'an',

    'and',
    'or',

    'of',
    'to',
    'in',
    'on',

    'for',
    'with',
    'from',

    'at',
    'by',

    'is',
    'are',
    'was',
    'were',

    'has',
    'have',
    'had',

    'this',
    'that',
    'these',
    'those',

    'after',
    'before',

    'over',
    'under',
    'into',

    'as',

    'its',
    'their',
    'his',
    'her',

    'new',
    'news',

    'says',
    'said',

    'according',

    'will',
    'would',

    'can',
    'could',

    'may',
    'might'
  ]);


  // ==========================================
  // GET IMPORTANT WORDS
  // ==========================================

  const getImportantWords = (text) => {

    const normalized = normalizeText(text);

    if (!normalized) {
      return [];
    }

    return normalized
      .split(' ')
      .filter((word) => {

        // Ignore very short words
        if (word.length <= 2) {
          return false;
        }

        // Ignore common English words
        if (stopWords.has(word)) {
          return false;
        }

        return true;
      });
  };


  // ==========================================
  // GET UNIQUE WORDS
  // ==========================================

  const getWordSet = (text) => {

    return new Set(
      getImportantWords(text)
    );
  };


  // ==========================================
  // CALCULATE WORD SIMILARITY
  // ==========================================

  const calculateSimilarity = (text1, text2) => {

    const words1 = getWordSet(text1);
    const words2 = getWordSet(text2);


    if (
      words1.size === 0 ||
      words2.size === 0
    ) {
      return 0;
    }


    let commonWords = 0;


    words1.forEach((word) => {

      if (words2.has(word)) {
        commonWords++;
      }

    });


    // ------------------------------------------
    // JACCARD SIMILARITY
    // ------------------------------------------

    const unionSize = new Set([
      ...words1,
      ...words2
    ]).size;


    const jaccard =
      commonWords / unionSize;


    // ------------------------------------------
    // OVERLAP SIMILARITY
    //
    // This is useful when one headline is shorter.
    //
    // Example:
    //
    // "PM orders strict action over PIMS fire"
    //
    // "PM orders strict action over PIMS hospital fire"
    //
    // The second title contains almost all words
    // from the first title.
    // ------------------------------------------

    const smallerSize = Math.min(
      words1.size,
      words2.size
    );


    const overlap =
      commonWords / smallerSize;


    /*
      Use the stronger score.

      This helps detect the same story even if
      one source has added extra words.
    */

    return Math.max(
      jaccard,
      overlap
    );
  };


  // ==========================================
  // CHECK WHETHER TWO ARTICLES ARE DUPLICATES
  // ==========================================

  const isDuplicateArticle = (
    article,
    existingArticles
  ) => {

    const currentTitle =
      article.title || '';

    const currentDescription =
      article.description || '';


    // ------------------------------------------
    // CHECK AGAINST EVERY EXISTING ARTICLE
    // ------------------------------------------

    for (
      const existingArticle of existingArticles
    ) {

      const existingTitle =
        existingArticle.title || '';

      const existingDescription =
        existingArticle.description || '';


      // ========================================
      // 1. EXACT NORMALIZED TITLE
      // ========================================

      const normalizedCurrentTitle =
        normalizeText(currentTitle);

      const normalizedExistingTitle =
        normalizeText(existingTitle);


      if (
        normalizedCurrentTitle &&
        normalizedCurrentTitle ===
        normalizedExistingTitle
      ) {

        console.log(
          'Exact duplicate removed:',
          currentTitle
        );

        return true;
      }


      // ========================================
      // 2. TITLE vs TITLE
      // ========================================

      const titleSimilarity =
        calculateSimilarity(
          currentTitle,
          existingTitle
        );


      /*
        0.70 is deliberately used here.

        Higher = more strict

        Lower = catches more duplicates but
        may accidentally remove different stories.
      */

      if (titleSimilarity >= 0.70) {

        console.log(
          'Similar title duplicate removed:',
          currentTitle
        );

        console.log(
          'Existing:',
          existingTitle
        );

        console.log(
          'Similarity:',
          titleSimilarity
        );

        return true;
      }


      // ========================================
      // 3. DESCRIPTION vs DESCRIPTION
      // ========================================

      const descriptionSimilarity =
        calculateSimilarity(
          currentDescription,
          existingDescription
        );


      if (
        descriptionSimilarity >= 0.80
      ) {

        console.log(
          'Similar description duplicate removed:',
          currentTitle
        );

        return true;
      }


      // ========================================
      // 4. TITLE vs EXISTING DESCRIPTION
      // ========================================

      const titleDescriptionSimilarity =
        calculateSimilarity(
          currentTitle,
          existingDescription
        );


      if (
        titleDescriptionSimilarity >= 0.75
      ) {

        console.log(
          'Title/description duplicate removed:',
          currentTitle
        );

        return true;
      }


      // ========================================
      // 5. DESCRIPTION vs EXISTING TITLE
      // ========================================

      const descriptionTitleSimilarity =
        calculateSimilarity(
          currentDescription,
          existingTitle
        );


      if (
        descriptionTitleSimilarity >= 0.75
      ) {

        console.log(
          'Description/title duplicate removed:',
          currentTitle
        );

        return true;
      }

    }


    // ------------------------------------------
    // ARTICLE IS UNIQUE
    // ------------------------------------------

    return false;
  };


  // ==========================================
  // FETCH NEWS
  // ==========================================

  const fetchNews = useCallback(
    async (pageToken = null) => {

      if (props.setProgress) {
        props.setProgress(10);
      }


      setLoading(true);


      try {

        // ======================================
        // API URL
        // ======================================

        let url =
          `https://newsdata.io/api/1/news` +
          `?apikey=${props.apiKey}` +
          `&country=${props.country}` +
          `&language=en` +
          `&size=${props.pageSize}` +
          `&q=${encodeURIComponent(props.category)}`;


        // ======================================
        // PAGINATION TOKEN
        // ======================================

        if (pageToken) {

          url += `&page=${encodeURIComponent(
            pageToken
          )}`;

        }


        console.log(
          'Fetching:',
          url
        );


        // ======================================
        // API REQUEST
        // ======================================

        const response =
          await fetch(url);


        if (!response.ok) {

          throw new Error(
            `HTTP error: ${response.status}`
          );

        }


        const parsedData =
          await response.json();


        console.log(
          'NewsData response:',
          parsedData
        );


        // ======================================
        // CHECK API RESPONSE
        // ======================================

        if (
          parsedData.status === 'success' &&
          parsedData.results &&
          Array.isArray(parsedData.results)
        ) {


          if (props.setProgress) {
            props.setProgress(30);
          }


          // ====================================
          // FILTERED ARTICLES
          // ====================================

          const filteredArticles = [];


          // ====================================
          // PROCESS EVERY API ARTICLE
          // ====================================

          for (
            const article of parsedData.results
          ) {


            // ==================================
            // FILTER 1
            // REMOVE API DUPLICATES
            // ==================================

            if (article.duplicate) {

              console.log(
                'API duplicate removed:',
                article.title
              );

              continue;
            }


            // ==================================
            // FILTER 2
            // ONLY TODAY
            // ==================================

            if (
              !isToday(article.pubDate)
            ) {

              console.log(
                'Old article removed:',
                article.pubDate,
                article.title
              );

              continue;
            }


            // ==================================
            // FILTER 3
            // SMART DUPLICATE CHECK
            // ==================================

            if (
              isDuplicateArticle(
                article,
                seenArticlesRef.current
              )
            ) {

              // Already exists
              continue;
            }


            // ==================================
            // ARTICLE IS UNIQUE
            // ==================================

            filteredArticles.push(article);


            /*
              Store the ORIGINAL article in the
              duplicate database.

              We intentionally do NOT use:

              - image_url
              - source_name
              - article_id

              because those can be wrong/different.
            */

            seenArticlesRef.current.push(
              article
            );

          }


          // ====================================
          // DEBUG INFORMATION
          // ====================================

          console.log(
            '================================'
          );

          console.log(
            'API articles:',
            parsedData.results.length
          );

          console.log(
            'Unique today articles:',
            filteredArticles.length
          );

          console.log(
            'Total seen articles:',
            seenArticlesRef.current.length
          );

          console.log(
            'Next page:',
            parsedData.nextPage
          );

          console.log(
            '================================'
          );


          if (props.setProgress) {
            props.setProgress(60);
          }


          // ====================================
          // UPDATE ARTICLES
          // ====================================

          if (pageToken) {

            /*
              This is another page.

              Append only the NEW filtered
              articles.

              DO NOT append again in fetchMore().
            */

            setArticles(
              (previousArticles) => [
                ...previousArticles,
                ...filteredArticles
              ]
            );

          } else {

            /*
              First page
            */

            setArticles(
              filteredArticles
            );

          }


          // ====================================
          // UPDATE STATE
          // ====================================

          setLoading(false);

          setError(null);

          setTotalResults(
            parsedData.totalResults || 0
          );

          setNextPageToken(
            parsedData.nextPage || null
          );

          setHasMore(
            !!parsedData.nextPage
          );


          setPage(
            (previousPage) =>
              pageToken
                ? previousPage + 1
                : 1
          );


          if (props.setProgress) {
            props.setProgress(100);
          }


          // ====================================
          // RETURN RESULT
          // ====================================

          return {

            articles: filteredArticles,

            totalResults:
              parsedData.totalResults || 0,

            nextPageToken:
              parsedData.nextPage || null,

            hasMore:
              !!parsedData.nextPage

          };

        }


        // ======================================
        // API ERROR
        // ======================================

        setArticles([]);

        setLoading(false);

        setError(
          parsedData.message ||
          'No articles found'
        );

        setHasMore(false);


        if (props.setProgress) {
          props.setProgress(100);
        }


        return null;

      } catch (fetchError) {

        console.error(
          'Error fetching news:',
          fetchError
        );


        setArticles([]);

        setLoading(false);

        setError(
          'Failed to fetch news'
        );

        setHasMore(false);


        if (props.setProgress) {
          props.setProgress(100);
        }


        return null;
      }

    },

    [
      props.apiKey,
      props.country,
      props.pageSize,
      props.category,
      props.setProgress
    ]
  );


  // ==========================================
  // FETCH MORE NEWS
  // ==========================================

  const fetchMore = useCallback(
    async () => {

      /*
        Don't request anything if there is
        no next page.
      */

      if (!nextPageToken) {

        console.log(
          'No more pages available.'
        );

        return;
      }


      console.log(
        'Fetching next page...'
      );


      /*
        IMPORTANT:

        fetchNews() already adds the articles
        to state.

        Therefore we DO NOT do:

        setArticles(prev =>
          prev.concat(result.articles)
        )

        here.

        That was causing duplicate articles
        in your original code.
      */

      const result =
        await fetchNews(nextPageToken);


      if (result) {

        setTotalResults(
          result.totalResults
        );

        setNextPageToken(
          result.nextPageToken
        );

        setHasMore(
          result.hasMore
        );

      }

    },

    [
      nextPageToken,
      fetchNews
    ]
  );


  // ==========================================
  // INITIAL FETCH + CATEGORY CHANGE
  // ==========================================

  useEffect(() => {

    /*
      Create a unique request ID.

      This helps avoid unnecessary duplicate
      requests during development.
    */

    const requestId =
      `${props.category}-${Date.now()}`;

    categoryRequestRef.current =
      requestId;


    // ========================================
    // RESET STATE
    // ========================================

    setArticles([]);

    setLoading(true);

    setPage(1);

    setNextPageToken(null);

    setHasMore(true);

    setError(null);

    setTotalResults(0);


    // ========================================
    // RESET DUPLICATE DATABASE
    // ========================================

    seenArticlesRef.current = [];


    // ========================================
    // FETCH FIRST PAGE
    // ========================================

    fetchNews();


    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [props.category]);


  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading && articles.length === 0) {

    return (

      <div className="container news-container">

        <h2>
          Top Headlines
        </h2>


        <div className="loading-container">

          <div
            className="loading-spinner spinner-border"
            role="status"
          >

            <span className="visually-hidden">
              Loading...
            </span>

          </div>

        </div>

      </div>

    );
  }


  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (
    error &&
    articles.length === 0
  ) {

    return (

      <div className="container news-container">

        <h2>
          Top Headlines
        </h2>


        <div className="error-message">

          <p style={{ color: 'red' }}>

            ⚠️ {error}

          </p>

        </div>

      </div>

    );
  }


  // ==========================================
  // NO ARTICLES
  // ==========================================

  if (
    !articles ||
    articles.length === 0
  ) {

    return (

      <div className="container news-container">

        <h2>
          Top Headlines
        </h2>


        <p style={{ color: 'red' }}>

          ⚠️ No news articles found for today.
          Please try again later.

        </p>

      </div>

    );
  }


  // ==========================================
  // MAIN UI
  // ==========================================

  return (

    <div className="container news-container">

      <h2>

        Top Headlines from{' '}

        {capitalizeFirstCharacter(
          props.category
        )}

      </h2>


      <div className="container">

        <InfiniteScroll

          dataLength={
            articles.length
          }

          next={fetchMore}

          hasMore={hasMore}


          loader={

            <div
              className="text-center my-4"
            >

              <div
                className="loading-spinner spinner-border"
                role="status"
              >

                <span className="visually-hidden">
                  Loading...
                </span>

              </div>


              <p
                style={{
                  color: 'white',
                  marginTop: '10px'
                }}
              >

                Loading more news...

              </p>

            </div>

          }


          endMessage={

            <p
              style={{
                textAlign: 'center',
                color: 'white',
                marginTop: '20px'
              }}
            >

              <b>
                All today's news loaded.
              </b>

            </p>

          }

        >


          <div className="row">

            {articles.map(
              (element, index) => {

                return (

                  <div
                    className="col-md-4"
                    key={
                      `${element.article_id || 'article'}-${index}`
                    }
                  >

                    <NewsItem

                      title={
                        element.title
                          ? element.title.slice(
                              0,
                              65
                            )
                          : 'None'
                      }


                      description={
                        element.description
                          ? element.description.slice(
                              0,
                              100
                            )
                          : 'None'
                      }


                      imageUrl={
                        element.image_url
                      }


                      newsUrl={
                        element.link
                      }


                      source={
                        element.source_name
                      }


                      date={
                        element.pubDate
                      }

                    />

                  </div>

                );

              }
            )}

          </div>


        </InfiniteScroll>

      </div>

    </div>

  );
};


// ==========================================
// DEFAULT PROPS
// ==========================================

News.defaultProps = {

  country: 'PK',

  pageSize: 8,

  category: 'general'

};


// ==========================================
// PROP TYPES
// ==========================================

News.propTypes = {

  country: PropTypes.string,

  pageSize: PropTypes.number,

  category: PropTypes.string,

  apiKey: PropTypes.string,

  setProgress: PropTypes.func

};


export default News;