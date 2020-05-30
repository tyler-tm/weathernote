# WeatherNote 🌩

WeatherNote was (and will be) an AWS Lambda function that sends daily weather info from the ~~DarkSky~~ OpenWeatherMap API as an email via AWS SES, in one short ~~JS~~ TS file. The plan is to have no outside dependencies, besides the AWS SDK for interacting with SES and [Denofun](https://github.com/galkowskit/denofun) for some Functional Programming utilities.

This was working as a single, ~100 line JavaScript file that you could deploy as an AWS Lambda function, but I am rewriting it for a couple reasons:

- The DarkSky API [will be going away, and no longer accepts new signups for access](https://blog.darksky.net/)
- I'm interested in having it run on Deno and follow a more functional paradigm

Currently, `main.ts` will output the temperature at given coordinates. Just clone the repo, add a `client-values.json` file in the same directory as `main.ts`, and try `deno run --allow-read --allow-net main.ts`.

The `client-values.json` file should look something like this:

```
{
  "appid": "dc5eb39d1fdba8db8c08fdb34c8682b3",
  "coords": [40.30969, -105.66679]
}
```
