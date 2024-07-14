# Study Buddy

Study Buddy provides tools that are designed to make your school life easier!
He can help you create organized lists of upcoming tests, quizzes, and events, and
he will remind you the night before so that you won't forget.
He can even calculate your GPA so that you don't have to do the math yourself.

## Commands

<ul>
  <li><b>/test:</b> Just makes sure the bot works :)</li>
<li><b>/hi:</b> He will greet you back!</li>
<li><b>/classes:</b> View a list of all the classes you've added! There is a 'Choose...' button that allows
the user to choose what classes they are currently enrolled in. Choosing classes ensures that the 
  user will get notified of upcoming events.</li>
<li><b>/add-class:</b> Adds a class to the list of classes.</li>
<li><b>/remove-class:</b> Removes a class from the list of classes. Be careful, this will delete the class
  and all the userIds associated with it.</li>
  <li><b>/events:</b> View a list of all upcoming tests, quizzes, events, and deadlines. The first column is
  the class name, the second column is the event name, and the third column is the date.</li>
  <li><b>/add-event:</b> Adds an event to the list of events.</li>
  <li><b>/remove-event:</b> Removes an event from the list of events.</li>
  <li><b>/calculate-gpa:</b> Calculates your ranked GPA (according to my school's GPA guildelines).
    Pressing a button will open a modal where you can enter your grades for each class that you are
    currently enrolled in.</li>
  <li><b>Additional:</b> The bot is programmed to remind users of the next day's events in the event list, at 8pm.
  It will ping the people who are enrolled in the class that the event corresponds to. Also, it will
  delete the current day's events, as they have probably already been completed by 8pm.</li>
</ul>

## Sources

<ul>
<li>  ChatGPT - Used for debugging help mainly; this is my first discord bot/open source project so
it was a bit of a struggle, I'm getting the hang of it though! :D<br><br>
  <details>
<summary>Code generated</summary>
    <ul>
     <li>readData() and writeData() functions in utils.js (lines 8-27).</li> 
      <li>Most of cron.schedule in app.js (lines 1245-1330); some parts were modified. </li>
      <li>Some parts of the 'add-event' application command interaction in app.js, lines 261-271 and 289-295.</li>
    </ul>
     </details>
</li>

<li>Discord's Getting Started Guide - https://discord.com/developers/docs/quick-start/getting-started \n
  (Specific project used - https://github.com/discord/discord-example-app)

I used the discord example app as starter code; most of it was deleted or modified.<br>
  <details>
<summary>Code kept</summary>
    <ul>
      <li>DiscordRequest, VerifyDiscordRequest, InstallGlobalCommands functions in utils.js.</li>
      <li>Import statements in the beginning of app.js. Added a lot of import statements myself over time.</li>
      <li>Setting up the bot at lines 34-38, as well as lines 60-90, in app.js.</li>
    </ul>
      </details>
  </li>
</ul>

Language: Javascript <br>
IDE: Glitch (https://glitch.com/) <br>
Library: Discord-interactions (https://github.com/discord/discord-interactions-js) <br>
Web framework: Express (https://expressjs.com/) <br>
Module: Discord.js (https://discord.js.org/)
