const express = require("express")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const axios = require("axios")

require("dotenv").config()
 

const API_KEY = process.env.API_KEY
const API_URL = "https://v6.exchangerate-api.com/v6"


const app = express() 


// ! limit the user req number to be at the most 100 in the 15 min
const apiLimiter = rateLimit({
    windowMs : 15 * 60 * 1000 ,
    max : 100
}) 


// ! middlwares
app.use(express.json())
app.use(cors())


// ! built in middlwares
app.use(apiLimiter)


// ! convert routes
app.post("/api/convert" , async (req , res , next) => {

    const {from , to , amount} = req.body

    try {

        const url = `${API_URL}/${API_KEY}/pair/${from}/${to}/${amount}`

        const response = await axios.get(url)

        if(response.data && response.data.result){
            res.json({
                base : from ,
                target : to ,
                conversionRate : response.data.conversion_rate ,
                conversionAmmount : response.data.conversion_result ,
            })
        }

    } catch (error) {
        
    }
})




// ! server run
const PORT = process.env.PORT || 3001

app.listen(PORT , () => console.log(`Currency Convertor Server started on port ${PORT}`))