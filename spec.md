# Sultan Live Scores

## Current State
All screens use static mock data. API key in Settings is not persisted or used.

## Requested Changes (Diff)

### Add
- `services/footballApi.ts` — REST client for football-data.org v4
- `hooks/useApiKey.ts` — localStorage getter/setter
- `hooks/useLiveMatches.ts` — polls /v4/matches every 30s

### Modify
- SettingsScreen: persist API key to localStorage, verify with test call
- HomeScreen: use real API data when key present, fall back to mock
- LeagueDetailScreen: fetch standings/matches from API when key present
- MatchDetailScreen: poll for score updates every 30s

### Remove
Nothing removed; mock data stays as fallback.

## Implementation Plan
1. Write footballApi.ts mapping API shapes to existing Match/Standing types
2. Write useApiKey hook
3. Write useLiveMatches hook with 30s interval
4. Update SettingsScreen to save key and show status
5. Update HomeScreen to use hook, fall back to mock
6. Update LeagueDetailScreen with real data
7. Validate and deploy
