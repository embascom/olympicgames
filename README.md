# The Olympic Games
By Arjun Aggarwal, Emily Bascom, and Ally Krinsky

The hosted website can be found [here]()).

To run the program locally on a local web server:
1. Open `Terminal` (for Mac) or `Command Prompt` (for Windows). 
2. Navigate to the folder where you would like to clone the Olympic Games repository to using for example `cd /Documents/Olympic_Games`.
3. Clone this Olympic Games repository to your local device in the folder you navigated to in the step above using `git clone https://github.com/embascom/olympicgames.git` or through an [SSH key](https://www.toolsqa.com/git/clone-repository-using-ssh/).
4. Through your machine's terminal, navigate in to your newly cloned repository using `cd olympicgames` command in your terminal.
5. Once inside your repository, you will need to run a Python command which will create an HTTP web server for this current directory and all of its sub-directories. In the console execute the following command if you are running Python 2.x:
    `python -m SimpleHTTPServer 8080`
If you are running Python 3.x or higher, use:
    `python -m http.server 8080` or `python3 -m http.server.8080`
Additionally, you can run the following code from the `olympicgames` folder in your terminal, which is the method used for running a [live server](https://github.com/tapio/live-server) in the INFO 340 class ([See the bottom of Chapter 2 of Client-Side Web Development Textbook](https://info340.github.io/client-side-development.html)):
    `npm install -g live-server`
    `live-server viz`
6. Lastly, pen your browser and type `http://localhost:8080/` in the URL bar and press enter or go.

## Domain
We are working in the domain of international sports, specifically the Olympic Games. The Olympic Games are an “international sporting event featuring summer and winter sports competitions in which thousands of athletes from around the world participate in a variety of competitions” [[1]](https://en.wikipedia.org/wiki/Olympic_Games). The Olympic Games occur every two years, alternating between the Summer Games and the Winter Games. At this point, nearly every nation is represented in the Olympic Games; the Summer Olympics having grown from 241 participants representing 14 nations in 1896, to more than 11,200 competitors representing 207 nations in 2016 with the Winter Olympics being much smaller as the 2018 Pyeongchang games hosted only 2,922 athletes from 92 nations [[1]](https://en.wikipedia.org/wiki/Olympic_Games). The Olympic Games are also an extremely important societal event. In 2000, the Olympic officials established the International Olympic Truce Foundation to “encourage the study of world peace and the creation of progress in its pursuit,” to encourage countries not engage in war during the Olympic Games [[2]](https://www.britannica.com/topic/The-Olympic-Truce-1688469). Although the Olympic Games exist to encourage international peace, the Games have been a platform for political protest throughout its history through boycotts, protests, and bannings [[3]](https://www.britannica.com/list/7-significant-political-events-at-the-olympic-games). This combination of sports and political significance has made us extremely interested in working with Olympic Games data for this project.

## Dataset
The dataset we will be working with is a publicly available dataset from Kaggle called, “120 years of Olympic history: athletes and results.” This dataset contains 271116 rows and 15 columns. Each row corresponds to an individual athlete competing in an individual Olympic event. The columns are ID (unique number for each athlete), Name (athlete's name), Sex (male or female), Age (age as an integer), Height (in centimeters), Weight (in kilograms), Team (team name), NOC (National Olympic Committee 3-letter code), Games (year and season), Year (year as an Integer), Season (Summer or Winter), City (host city), Sport, Event, and Medal (Gold, Silver, Bronze, or NA). A link to the dataset can be found [here](https://www.kaggle.com/heesoo37/120-years-of-olympic-history-athletes-and-results).
