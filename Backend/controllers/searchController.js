exports.searchReq = async (req,res) => {
  
    // Set the search value variable passed in from the api request
    const {searchValue} = req.body;
    const apiKey = process.env.REACT_APP_OMDB_API_KEY;

    try { 

        const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchValue}`;
        
        console.log("API ENDPOINT FOR SEARCHING:", url);
        
        const response = await fetch(url);
        
        // Response is ok (200-299 Status Code)
        if (response.ok) {
            // Create Movies List object and return to the frontend
            const queryResponse = await response.json();
            const {Search,totalResults,Response} = queryResponse;
            
            // If A list of movies is returned (Response == True)
            if(Response){
                return res.status(200).json({movies: Search, totalResults: totalResults, validResponse: Response});
            }
            // If A list of movies is not returned (Response == False)
            else{
                return res.status(500).json({validResponse: Response});
            }
        // Response is not ok (Bad (!= 200-299) Status Code)
        } else {
            res.status(500).json({ message: 'API error', error });
        }
    } catch (error) {
        console.error('Error retrieving data from OMDb API:', error);
        res.status(500).json({ message: 'Server error', error })
    }
    
  };