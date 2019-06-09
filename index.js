const AWS = require("aws-sdk");

/*
 * Define the DarkSky API as an AWS Service,
 * so we can make high-level HTTP calls from Lambda
 */
const darkSkyService = new AWS.Service({
  endpoint: "https://api.darksky.net/",
  convertResponseTypes: false,
  apiConfig: {
    metadata: {
      protocol: "rest-json"
    },
    operations: {
      GetForecast: {
        http: {
          method: "GET",
          requestUri:
            "/forecast/{apiKey}/{targetCoords}" +
            "?exclude=currently,minutely,hourly"
        },
        input: {
          type: "structure",
          required: ["apiKey", "targetCoords"],
          members: {
            apiKey: {
              type: "string",
              location: "uri",
              locationName: "apiKey"
            },
            targetCoords: {
              type: "string",
              location: "uri",
              locationName: "targetCoords"
            }
          }
        }
      }
    }
  }
});

const getTodaysForecast = () => {
  return new Promise((resolve, reject) => {
    darkSkyService.getForecast(
      {
        apiKey: process.env.DARKSKY_API_KEY,
        targetCoords: process.env.TARGET_COORDS
      },
      (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      }
    );
  });
};

const convertEpochToLocalDateTime = epoch =>
  new Date(epoch * 1000).toLocaleTimeString("en-US", {
    timeZone: "America/New_York"
  });

const getDailyInfoFromForecast = forecast => {
  const todaysData = forecast.daily.data[0];

  const dailyInfo = {
    daySummary: todaysData.summary,
    high: todaysData.temperatureMax,
    highTime: convertEpochToLocalDateTime(todaysData.temperatureMaxTime),
    low: todaysData.temperatureMin,
    lowTime: convertEpochToLocalDateTime(todaysData.temperatureMinTime),
    uvHigh: todaysData.uvIndex,
    uvHighTime: convertEpochToLocalDateTime(todaysData.uvIndexTime)
  };

  return dailyInfo;
};

const sendEmail = emailBody => {
  const params = {
    Destination: {
      ToAddresses: [process.env.TO_ADDRESS]
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: emailBody
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "WeatherNote"
      }
    },
    Source: process.env.FROM_ADDRESS,
    ReplyToAddresses: [process.env.FROM_ADDRESS]
  };

  return new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();
};

exports.handler = async () => {
  await getTodaysForecast()
    .then(async forecast => {
      console.log(getDailyInfoFromForecast(forecast));
      await sendEmail("Test Body")
        .then(result => {
          console.log(`email sent: ${result}`);
        })
        .catch(error => {
          console.log(`error sending email: ${error}`);
        });
    })
    .catch(console.error);
};
