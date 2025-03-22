exports.searchReq = async (req,res) => {
  
    // Set the search value variable passed in from the api request
    const {searchValue} = req.body;
    const apiKey = process.env.REACT_APP_OMDB_API_KEY;

    try { 

        const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchValue}`;
        
        const response = await fetch(url);
        
        // Response is ok (200-299 Status Code)
        if (response.ok) {
            // Create Movies List object and return to the frontend
            const queryResponse = await response.json();
            const {Search,totalResults,Response, Error} = queryResponse;
            
            // If A list of movies is returned (Response == True)
            if(!Error){
                return res.status(200).json({movies: Search, totalResults: totalResults, validResponse: Response});
            }
            // If A list of movies is not returned (Response == False)
            else{
                return res.status(500).json({error: Error, validResponse: Response});
            }
        // Response is not ok (Bad (!= 200-299) Status Code)
        } else {
            return res.status(500).json({ message: 'API error', error: "Bad API Return Status code" });
        }
    } catch (error) {
        req.log.error('Error retrieving data from OMDb API:', error);
        return res.status(500).json({ message: 'Server error', errorMsg: error })
    }
    
  };

exports.searchAdditional = async (req,res) => {

    const {movie} = req.body;
    const apiKey = process.env.REACT_APP_OMDB_API_KEY;
    
    try { 
        const url = `http://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`;
         
        // baseLogger.info("API ENDPOINT FOR SEARCHING IN DEPTH INFO:", url);
         
        const response = await fetch(url);
        
        // Response is ok (200-299 Status Code)
        if (response.ok) {
            // Create Movies List object and return to the frontend
            const queryResponse = await response.json();
            // If A list of movies is returned (Response == True)
            if(queryResponse){
                return res.status(200).json({movies: queryResponse, validResponse: true});
            }
            // If A list of movies is not returned (Response == False)
            else{
                return res.status(500).json({validResponse: false});
            }
        // Response is not ok (Bad (!= 200-299) Status Code)
        } else {
            return res.status(500).json({ message: 'API error', error: "Bad API Return Status CODE" });
        }
    } catch (error) { 
        req.log.error('Error retrieving data from OMDb API:', error);
        return res.status(500).json({ message: 'Server error', errorMsg: error })
    }
} 