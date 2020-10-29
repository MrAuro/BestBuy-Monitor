const axios = require('axios');
const moment = require('moment');
const config = require('../config/setting.json')
const chalk = require('chalk')

require("dotenv").config();

async function send(product){
    console.log(chalk.yellow("Sending notification to discord"))
    try{
        axios({
            method: 'POST',
            url: `${config.Discord.Webhook}`,
            headers:{
                "Content-type": "application/json"
            },
            data:{
                "username": "Best Buy",
                embeds: [{
                    url: `${product.Url}`,
                    title:`${product.Name}`,
                    description: ` **SKU**: ${product.Sku} | **Price**: ${product.Price} \n\n **Status**: :new:`,
                    color: "12419071",
                    footer:{
                        icon_url:
                    'https://corporate.bestbuy.com/wp-content/uploads/2018/03/BBY_on_blue.jpg',
                  text: `Best Buy | v1.0 | ${moment().format(
                    'MMMM Do YYYY - h:mm:ss a'
                  )}`
                    },
                    thumbnail: {
                        url: `${product.Image}`
                    },
                    fields:[
                        {
                            "name": "Status",
                            "value": "In stock"
                        }
                    ]
                }]
            }
        })
    }catch(e){
        console.log(chalk.red("Error sending discord webhook :" , e))
        return
    }
    try {
        var twilio = require('twilio');

        // Find your account sid and auth token in your Twilio account Console.
        var client = new twilio(process.env.SID, process.env.TOKEN);        
        // Send the text message.
        client.messages.create({
          to: process.env.TO,
          from: process.env.FROM,
          body: `${product.name} is in stock for ${product.Price} (SKU: ${product.Sku})`
        });
    }catch(e){
        console.log(chalk.red("Error sending text message :", e))
    }
}


module.exports = {send}