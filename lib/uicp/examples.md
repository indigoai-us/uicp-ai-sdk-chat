# UICP Examples

This file contains example UICP blocks you can test with.

## NBA Game Score Examples

### Example 1: Final Game
```uicp
{
  "uid": "NBAGameScore",
  "data": {
    "homeTeam": "Los Angeles Lakers",
    "awayTeam": "Boston Celtics",
    "homeScore": 108,
    "awayScore": 105,
    "gameDate": "Oct 26, 2025",
    "gameStatus": "final"
  }
}
```

### Example 2: Live Game
```uicp
{
  "uid": "NBAGameScore",
  "data": {
    "homeTeam": "Golden State Warriors",
    "awayTeam": "Brooklyn Nets",
    "homeScore": 67,
    "awayScore": 72,
    "gameDate": "Oct 26, 2025",
    "gameStatus": "live",
    "quarter": "Q3",
    "timeRemaining": "5:23"
  }
}
```

### Example 3: Scheduled Game
```uicp
{
  "uid": "NBAGameScore",
  "data": {
    "homeTeam": "Miami Heat",
    "awayTeam": "Chicago Bulls",
    "homeScore": 0,
    "awayScore": 0,
    "gameDate": "Oct 27, 2025",
    "gameStatus": "scheduled"
  }
}
```

### Example 4: Overtime Game
```uicp
{
  "uid": "NBAGameScore",
  "data": {
    "homeTeam": "Dallas Mavericks",
    "awayTeam": "Phoenix Suns",
    "homeScore": 118,
    "awayScore": 115,
    "gameDate": "Oct 25, 2025",
    "gameStatus": "final",
    "quarter": "OT",
    "timeRemaining": "Final"
  }
}
```

## Testing in Chat

You can ask the AI to create these components with prompts like:

1. **"Show me the Lakers vs Celtics game where Lakers won 108-105"**
2. **"Display a live Warriors vs Nets game, currently 67-72 in the third quarter"**
3. **"Create a game score for the Heat vs Bulls game scheduled for tomorrow"**
4. **"Show me a Mavs vs Suns overtime game where Mavs won 118-115"**

## Component in Context

Here's how a UICP block looks in a full AI response:

```markdown
Here's the game you asked about:

```uicp
{
  "uid": "NBAGameScore",
  "data": {
    "homeTeam": "Los Angeles Lakers",
    "awayTeam": "Boston Celtics",
    "homeScore": 108,
    "awayScore": 105,
    "gameDate": "Oct 26, 2025",
    "gameStatus": "final"
  }
}
```

It was a close game with the Lakers coming out on top! LeBron scored 32 points
and Anthony Davis added 28 points and 12 rebounds. The Celtics fought hard but
couldn't close the gap in the fourth quarter.
```

The component will render inline with the text, creating a rich, visual experience.

## Bar Chart Examples

### Example 1: Website Traffic
```uicp
{
  "uid": "BarChart",
  "data": {
    "title": "Website Traffic",
    "description": "Monthly visitors by device type",
    "data": [
      { "category": "January", "desktop": 186, "mobile": 80 },
      { "category": "February", "desktop": 305, "mobile": 200 },
      { "category": "March", "desktop": 237, "mobile": 120 },
      { "category": "April", "desktop": 73, "mobile": 190 },
      { "category": "May", "desktop": 209, "mobile": 130 },
      { "category": "June", "desktop": 214, "mobile": 140 }
    ],
    "dataKeys": ["desktop", "mobile"]
  }
}
```

### Example 2: Sales Data
```uicp
{
  "uid": "BarChart",
  "data": {
    "title": "Quarterly Sales",
    "description": "Sales performance by region",
    "data": [
      { "category": "Q1", "north": 12000, "south": 8500, "east": 9200, "west": 11000 },
      { "category": "Q2", "north": 15000, "south": 9800, "east": 10500, "west": 13200 },
      { "category": "Q3", "north": 14200, "south": 10200, "east": 11800, "west": 12500 },
      { "category": "Q4", "north": 18000, "south": 12000, "east": 13500, "west": 16000 }
    ],
    "dataKeys": ["north", "south", "east", "west"],
    "height": "400px"
  }
}
```

## Line Chart Examples

### Example 1: Revenue Growth
```uicp
{
  "uid": "LineChart",
  "data": {
    "title": "Revenue Growth",
    "description": "Monthly revenue over 6 months",
    "data": [
      { "category": "January", "revenue": 4500, "expenses": 3200 },
      { "category": "February", "revenue": 5200, "expenses": 3400 },
      { "category": "March", "revenue": 4800, "expenses": 3600 },
      { "category": "April", "revenue": 6100, "expenses": 3800 },
      { "category": "May", "revenue": 7200, "expenses": 4000 },
      { "category": "June", "revenue": 8100, "expenses": 4200 }
    ],
    "dataKeys": ["revenue", "expenses"],
    "curved": true
  }
}
```

### Example 2: Temperature Trends
```uicp
{
  "uid": "LineChart",
  "data": {
    "title": "Temperature Trends",
    "description": "Average daily temperature by city",
    "data": [
      { "category": "Monday", "newYork": 72, "losAngeles": 85, "chicago": 68 },
      { "category": "Tuesday", "newYork": 75, "losAngeles": 87, "chicago": 70 },
      { "category": "Wednesday", "newYork": 73, "losAngeles": 86, "chicago": 69 },
      { "category": "Thursday", "newYork": 76, "losAngeles": 88, "chicago": 71 },
      { "category": "Friday", "newYork": 78, "losAngeles": 90, "chicago": 73 },
      { "category": "Saturday", "newYork": 80, "losAngeles": 89, "chicago": 75 },
      { "category": "Sunday", "newYork": 79, "losAngeles": 87, "chicago": 74 }
    ],
    "dataKeys": ["newYork", "losAngeles", "chicago"]
  }
}
```

## Testing in Chat

You can ask the AI to create these components with prompts like:

### Bar Charts:
1. **"Show me a bar chart of website traffic by month with desktop and mobile users"**
2. **"Create a bar chart comparing sales data across different regions"**
3. **"Display product sales for the last 6 months as a bar chart"**

### Line Charts:
1. **"Show me a line chart of revenue vs expenses over the last 6 months"**
2. **"Create a line chart showing temperature trends for different cities"**
3. **"Display stock prices over time as a line chart"**

## Adding Your Own Examples

When you create new components, add examples here following the same format:

### Your Component Name

```uicp
{
  "uid": "YourComponentUID",
  "data": {
    "field1": "value1",
    "field2": 123
  }
}
```

This helps with:
- Testing during development
- Documentation for users
- Examples for the AI to learn from
- Quick reference for data structures

