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

