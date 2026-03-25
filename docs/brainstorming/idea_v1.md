
# Plan V1 ✅ Executed

## General Ideas
Lets brainstorm a app idea: Expenses (we can decide on names later)

I have been writing my expenses in an excel sheet and may be in future we import the data (we are not doing that in phase 1) and this should be a small baby pet 🐕 project - A web app or a learning curve cli/android app.

* Phase 1 - A simple web page - could be typecript - react - vite based or just plain html; A couple of buttons, some text or preexisting labels/categories - we can save in local storage
* Phase 2 - A data store (deployable) maybe firebase or something similar - So if web app is deployed like static pages, we can move the data from local storage to main db (cloud or deployed) and the imported one from xls (optionally)
* Phase 3 - Cli app (go lang)
* Phase 4 - Desktop app (go lang)
* Phase 5 - Android app - maybe android studio or simpe Expo style (as react native)
* Phase 6 - Ponder if react app -> go lang based fresh or some web pages generator (web app migration to golang) 
* Phase 7 - 


## Detailed Ideas

### Existing rows

|Month|DAY|Sxum|DATE|Veg|Fruits|Milk|Healthy|Foods|Food Orders|Travel|Vehicle Maint|Bills|Fashion|Ration|Electonics|Med Doc Con|Meds|Misc|Additional Remarks|Borrowed|Lend|

### 1. **Data cols**
- Each row is a day and if say I eat breakfast - I punch in Rs 100 in Food, A juce Rs 50 in Healthy, Lunch another punch in Rs 100 in Food so in excel I edit exiting 100 to 200; Sxum is just a day total;
- So at the end of each year I have a total of all categories + the grand total of teh totals , I can do charts/pivots and easilt see how much I annual spend on milk or how much medical in April 
- I got mutiple sheets as years - then I got some special sheets - like Tax, Liablilities, Assets, Fuel (yes I got it all, how mch in last one year + approximate milage), And a dedicatd sheet my borrowing or lending) - later phases if needed not touching that yet
- Maybe we keep sub-categories (Food → Milk, Snacks, Edible Groceries, Healthy, Orders) & (Shoping -> Veggies, Fruits, Groceries, Fashion, Meds) (Travel, Vehichle mantainance can get a main category)
- We can track payment method (Cash / UPI / Card) but maybe not in phase 1
- Also there recurring expenses (rent, subscriptions). Some like phone /internet/netflix/google one etc can be a suggestion bubbles taht appear near the start of month or maybe always visible at start and later phases we add a date range when they appear.
- In the existing excel each day is a row, but when we do an entry from app it would be like each row for an expence (if we need a report we can group or whatever)

### 2. **Entry Speed - Hyper fast**
 - Option C Power-user command: when we will go for an cli example 
    `
    50 tea
    120 petrol
    300 lunch
    `
 - Option B Adv Form: Advance entry
 - Option A: Quick Buttons: Normal mode (Phase 1)

### 3. **Usage Style**
 - Desktop browser (web app)
 - Mobile browser (web app)
 - Android app  (web app -> native app)

### 4. **Offline vs Sync**
 - I can share with my family and it becomes a family expence tracker
 - But if I share with friends or - Lets plan it in future
 - Current XLS is in onedrive so naturally I can acess it via phone, web and desktop - I would like a similar system but for starters we can go web-only with local storage
 - maybe a export as a xls row and maually post it there unitll we get whatever to use figured out

### 5. **Data Privacy** 
 - Phase 1 & 2 - we can use personally and keep the repo also private
 - Ph3 (if we ever reach there) onwards we can make it public and add login/accounts


## Lets Elaborate - 
### Implementation of Ph 1 --- 
 - Add entry 
    - Pre-set todasy's date daya and time (or maybe no time maybe mmmaaaybbeeee) - with a option to backdate (or maybe future date an expense)
    - Pre-set categories selection
    - Amount - pre-set clicable amount bubbles and custom entry option as well
    - SAVE button or icon 
    - and i am thinking a bulk add button taht lets you add a json with entries like [{date: "2026-03-15", milk: 50, veggies: 10, health: 100}, {date: "2026-03-14", milk: 150, bill: 5000}] or maybe quick csv import 
 - List 
    - day wise feed 
    - caetgory wise feed (whatever that means)
    - options to see list, last weeb, this week, last month, this month, last 3, 6, 9, 12 months and a custom (taht would probably cover all)
 - Export/print view (optional - not a priority untill phase 3)
    - A simple view for print 
    - and maybe export (maybe later phases)


### Cloud Sync
 - Firebase
 - Supabase
