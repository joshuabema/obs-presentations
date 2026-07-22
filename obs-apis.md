# Bema Hub OBS APIs

This document lists every OBS presentation API currently implemented in the backend, how to call each one, accepted payload/query parameters, and representative responses.

Backend base URL:

```txt
https://wp.bemahub.com/wp-json/bmh/v1/obs
```

Local development base URL, when Local WP is running:

```txt
http://localhost:10003/wp-json/bmh/v1/obs
```

All endpoints are designed for OBS Browser Source scenes, lightweight polling, mock/simulated rehearsals, campaign spotlights, multi-campaign presentations, and operator-triggered presentation moments.

## Common query parameters

These are accepted by the OBS read endpoints unless noted otherwise.

| Parameter | Type | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `scope` | string | `system`, `campaign`, `multi_campaign`, `session`, `operator` | Optional | Defaults vary by endpoint. |
| `campaign` | string | campaign slug | Required for `scope=campaign` | Example: `eko-premiere`. |
| `campaigns` | string | comma-separated campaign slugs | Required for `scope=multi_campaign` | Example: `eko-premiere,splendid-launch`. |
| `session_id` | string | any session key | Required for `scope=session` | Example: `open_enrollment_may_2026`. |
| `started_at` | datetime | ISO/date string | Optional | Sets session start time for session stats. |
| `data_mode` | string | `live`, `simulated`, `hybrid` | Optional | `live` is default. Use `simulated` for OBS rehearsal. |
| `mock_mode` | boolean-ish | `true`, `1` | Optional | Shortcut for `data_mode=simulated`. |
| `response_mode` | string | `compact`, `standard`, `expanded` | Optional | Currently returns the same core shape, reserved for future payload sizing. |
| `limit` | integer | `1` to `100` | Optional | Used by activity/operator feeds. |

### Standard response metadata

Every successful read response includes:

```json
{
  "api_version": "v1_readiness",
  "response_mode": "standard",
  "data_mode": "live",
  "mock_mode": false,
  "scope": {
    "type": "system",
    "campaigns": [],
    "generated_at": "2026-06-19T08:30:00+00:00"
  },
  "updated_at": "2026-06-19T08:30:00+00:00"
}
```

For campaign and multi-campaign scopes, `scope.campaigns` is populated:

```json
{
  "scope": {
    "type": "multi_campaign",
    "campaigns": [
      {
        "slug": "eko-premiere",
        "title": "Eko Premiere"
      },
      {
        "slug": "splendid-launch",
        "title": "Splendid Launch"
      }
    ],
    "generated_at": "2026-06-19T08:30:00+00:00"
  }
}
```

For session scope, `scope.session_id` is included:

```json
{
  "scope": {
    "type": "session",
    "campaigns": [],
    "session_id": "open_enrollment_may_2026",
    "generated_at": "2026-06-19T08:30:00+00:00"
  }
}
```

## Scope examples

System-wide:

```http
GET /wp-json/bmh/v1/obs/live-stats?scope=system
```

Single campaign:

```http
GET /wp-json/bmh/v1/obs/live-stats?scope=campaign&campaign=eko-premiere
```

Multiple campaigns:

```http
GET /wp-json/bmh/v1/obs/live-stats?scope=multi_campaign&campaigns=eko-premiere,splendid-launch
```

Simulated rehearsal data:

```http
GET /wp-json/bmh/v1/obs/live-stats?scope=system&data_mode=simulated
```

Session-specific stats:

```http
GET /wp-json/bmh/v1/obs/session-stats?scope=session&session_id=open_enrollment_may_2026
```

## Endpoint summary

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| GET | `/obs/live-stats` | Main counters for OBS scenes | Public |
| GET | `/obs/live-activity` | Live feed, ticker, pop-ins | Public |
| GET | `/obs/referrals` | EchoLoop/referral summary | Public |
| GET | `/obs/funnel-summary` | Funnel/CTA movement | Public |
| GET | `/obs/campaign-status` | Campaign progress/status cards | Public |
| GET | `/obs/trends` | Chart data | Public |
| GET | `/obs/goal-progress` | Progress bars/milestones | Public |
| GET | `/obs/session-stats` | Presentation-session metrics | Public |
| GET | `/obs/operator-events` | Read curated operator events | Public |
| POST | `/obs/operator-events` | Trigger curated operator events | Admin only |
| GET | `/obs/presenter-state` | Presenter/lower-third state | Public |
| GET | `/obs/presentation-sequence` | Suggested presentation scene flow | Public |

---

## 1. GET `/obs/live-stats`

Main stat counters for OBS dashboards, speaker overlays, QR scenes, EchoLoop scenes, and closing scenes.

### Query examples

```http
GET /wp-json/bmh/v1/obs/live-stats?scope=system
```

```http
GET /wp-json/bmh/v1/obs/live-stats?scope=campaign&campaign=eko-premiere
```

```http
GET /wp-json/bmh/v1/obs/live-stats?scope=multi_campaign&campaigns=eko-premiere,splendid-launch
```

```http
GET /wp-json/bmh/v1/obs/live-stats?scope=system&data_mode=simulated
```

### Response

```json
{
  "api_version": "v1_readiness",
  "response_mode": "standard",
  "data_mode": "live",
  "mock_mode": false,
  "scope": {
    "type": "multi_campaign",
    "campaigns": [
      {
        "slug": "eko-premiere",
        "title": "Eko Premiere"
      },
      {
        "slug": "splendid-launch",
        "title": "Splendid Launch"
      }
    ],
    "generated_at": "2026-06-19T08:30:00+00:00"
  },
  "updated_at": "2026-06-19T08:30:00+00:00",
  "totals": {
    "active_participants": 325,
    "total_joined": 1200,
    "joined_today": 82,
    "joined_this_session": 18,
    "signups_recent": 6,
    "referral_conversions": 41,
    "referral_clicks": 215,
    "referral_links_created": 74,
    "total_shares": 390,
    "actions_this_session": 35,
    "first_actions_completed": 27,
    "qr_scans": 34,
    "cta_clicks": 21,
    "signup_completions": 11,
    "activity_per_minute": 3.4,
    "activity_velocity": "high"
  },
  "breakdown": [
    {
      "campaign_slug": "eko-premiere",
      "campaign_title": "Eko Premiere",
      "active_participants": 120,
      "total_joined": 500,
      "joined_today": 31,
      "joined_this_session": 8,
      "signups_recent": 3,
      "referral_conversions": 14,
      "referral_clicks": 87,
      "referral_links_created": 30,
      "total_shares": 88,
      "actions_this_session": 12,
      "first_actions_completed": 9,
      "qr_scans": 44,
      "cta_clicks": 28,
      "signup_completions": 7
    }
  ],
  "ambient_state": "active"
}
```

### Frontend usage

Poll every 5–10 seconds for stat cards and counters. For animated counters, compare the previous `totals` values with the newest values and animate the difference.

---

## 2. GET `/obs/live-activity`

Public-safe activity feed for tickers, live feeds, and pop-ins.

### Query examples

```http
GET /wp-json/bmh/v1/obs/live-activity?scope=system&limit=25
```

```http
GET /wp-json/bmh/v1/obs/live-activity?scope=campaign&campaign=eko-premiere&limit=10
```

```http
GET /wp-json/bmh/v1/obs/live-activity?scope=multi_campaign&campaigns=eko-premiere,splendid-launch&limit=50
```

```http
GET /wp-json/bmh/v1/obs/live-activity?scope=system&data_mode=simulated
```

### Response

```json
{
  "api_version": "v1_readiness",
  "response_mode": "standard",
  "data_mode": "live",
  "mock_mode": false,
  "scope": {
    "type": "campaign",
    "campaigns": [
      {
        "slug": "eko-premiere",
        "title": "Eko Premiere"
      }
    ],
    "generated_at": "2026-06-19T08:31:00+00:00"
  },
  "items": [
    {
      "id": "evt_10293",
      "event_type": "signup_completed",
      "event_category": "funnel",
      "message": "Sarah O. completed signup",
      "user_display_name": "Sarah O.",
      "campaign_slug": "eko-premiere",
      "campaign_title": "Eko Premiere",
      "project_title": "Open Enrollment",
      "artist_name": "Eko The Beat",
      "priority": "high",
      "display_mode": "ticker",
      "is_curated": false,
      "safe_for_public_display": true,
      "animation_hint": "slide_in",
      "animation_duration_ms": 600,
      "pulse_level": "medium",
      "transition_style": "slide_in",
      "scene_targets": [
        "ticker_bottom",
        "live_activity"
      ],
      "timestamp": "2026-06-19T08:31:00+00:00"
    }
  ],
  "updated_at": "2026-06-19T08:31:02+00:00"
}
```

### Frontend usage

Poll every 2–3 seconds for live feeds and tickers. Only render items where `safe_for_public_display` is `true`. Use `priority` and `display_mode` to decide whether an item goes into the ticker, feed, or pop-in layer.

---

## 3. GET `/obs/referrals`

Campaign-scoped or multi-campaign EchoLoop/referral summary.

### Query examples

```http
GET /wp-json/bmh/v1/obs/referrals?scope=system
```

```http
GET /wp-json/bmh/v1/obs/referrals?scope=campaign&campaign=eko-premiere
```

```http
GET /wp-json/bmh/v1/obs/referrals?scope=multi_campaign&campaigns=eko-premiere,splendid-launch
```

### Response

```json
{
  "api_version": "v1_readiness",
  "response_mode": "standard",
  "data_mode": "live",
  "mock_mode": false,
  "scope": {
    "type": "multi_campaign",
    "campaigns": [
      {
        "slug": "eko-premiere",
        "title": "Eko Premiere"
      }
    ],
    "generated_at": "2026-06-19T08:32:00+00:00"
  },
  "totals": {
    "total_referrals": 58,
    "approved_referrals": 41,
    "pending_referrals": 12,
    "rejected_referrals": 5,
    "referral_conversions": 19,
    "referral_clicks": 215,
    "referral_links_created": 74,
    "top_referrer_name": "Blessing A.",
    "top_referrer_count": 17
  },
  "breakdown": [
    {
      "campaign_slug": "eko-premiere",
      "campaign_title": "Eko Premiere",
      "total_referrals": 24,
      "approved_referrals": 18,
      "pending_referrals": 4,
      "rejected_referrals": 2,
      "referral_conversions": 9,
      "referral_clicks": 87,
      "referral_links_created": 30
    }
  ],
  "updated_at": "2026-06-19T08:32:00+00:00"
}
```

### Frontend usage

Poll every 5–10 seconds for EchoLoop scenes. For a campaign spotlight, use `scope=campaign`. For premiere artist open enrollment, use `scope=multi_campaign`.

---

## 4. GET `/obs/funnel-summary`

Funnel movement for landing views, QR scans, CTA clicks, signup starts, completions, and activation.

### Query examples

```http
GET /wp-json/bmh/v1/obs/funnel-summary?scope=system
```

```http
GET /wp-json/bmh/v1/obs/funnel-summary?scope=campaign&campaign=eko-premiere
```

```http
GET /wp-json/bmh/v1/obs/funnel-summary?scope=multi_campaign&campaigns=eko-premiere,splendid-launch
```

### Response

```json
{
  "api_version": "v1_readiness",
  "response_mode": "standard",
  "data_mode": "live",
  "mock_mode": false,
  "scope": {
    "type": "campaign",
    "campaigns": [
      {
        "slug": "eko-premiere",
        "title": "Eko Premiere"
      }
    ],
    "generated_at": "2026-06-19T08:33:00+00:00"
  },
  "totals": {
    "landing_views": 680,
    "qr_scans": 34,
    "cta_clicks": 21,
    "signup_starts": 18,
    "form_submits": 14,
    "signup_completions": 11,
    "email_verified_count": 9,
    "phone_verified_count": 6,
    "activated_accounts": 10,
    "onboarding_started": 8,
    "onboarding_completed": 5,
    "first_actions_completed": 4,
    "signup_completion_rate": 61.1,
    "conversion_percent": 32.3
  },
  "breakdown": [],
  "updated_at": "2026-06-19T08:33:00+00:00"
}
```

### Frontend usage

Use for funnel scenes and QR CTA scenes. Poll every 5–10 seconds if the scene is visible.

---

## 5. GET `/obs/campaign-status`

Campaign status and progress for one or more campaigns.

### Query examples

```http
GET /wp-json/bmh/v1/obs/campaign-status?scope=system
```

```http
GET /wp-json/bmh/v1/obs/campaign-status?scope=campaign&campaign=eko-premiere
```

```http
GET /wp-json/bmh/v1/obs/campaign-status?scope=multi_campaign&campaigns=eko-premiere,splendid-launch
```

### Response

```json
{
  "api_version": "v1_readiness",
  "response_mode": "standard",
  "data_mode": "live",
  "mock_mode": false,
  "scope": {
    "type": "multi_campaign",
    "campaigns": [
      {
        "slug": "eko-premiere",
        "title": "Eko Premiere"
      }
    ],
    "generated_at": "2026-06-19T08:34:00+00:00"
  },
  "campaigns": [
    {
      "campaign_slug": "eko-premiere",
      "campaign_title": "Eko Premiere",
      "status": "live",
      "goal": 500,
      "current_value": 235,
      "progress_percent": 47,
      "join_count": 142,
      "view_count": 680,
      "share_count": 88,
      "cta_responses": 32,
      "milestone_label": "Almost halfway",
      "presentation_theme": "premiere",
      "presentation_priority": 10,
      "presentation_headline": "THIS IS HAPPENING NOW",
      "presentation_subheadline": "Join the movement",
      "presentation_cta": "Scan To Join",
      "presentation_cta_short": "Join Now",
      "presentation_visual_style": "cinematic",
      "presentation_qr_enabled": true,
      "presentation_ticker_enabled": true
    }
  ],
  "updated_at": "2026-06-19T08:34:00+00:00"
}
```

### Frontend usage

Use for campaign spotlight cards, progress bars, and multi-campaign comparison scenes. Poll every 15–30 seconds.

---

## 6. GET `/obs/trends`

Chart data for joins, shares, actions, conversions, referrals, support, activity, QR scans, CTA clicks, and campaign progress.

### Extra query parameters

| Parameter | Type | Values | Default |
| --- | --- | --- | --- |
| `trend_type` | string | `joins`, `shares`, `actions`, `conversions`, `referrals`, `support`, `activity`, `qr_scans`, `cta_clicks`, `campaign_progress` | `joins` |
| `interval` | string | `1min`, `5min`, `10min`, `15min`, `30min`, `1hour`, `1day` | `5min` |
| `buckets` | integer | `2` to `288` | `12` |

### Query examples

```http
GET /wp-json/bmh/v1/obs/trends?scope=campaign&campaign=eko-premiere&trend_type=joins&interval=5min
```

```http
GET /wp-json/bmh/v1/obs/trends?scope=multi_campaign&campaigns=eko-premiere,splendid-launch&trend_type=referrals&interval=10min&buckets=12
```

### Response

```json
{
  "api_version": "v1_readiness",
  "response_mode": "standard",
  "data_mode": "live",
  "mock_mode": false,
  "scope": {
    "type": "campaign",
    "campaigns": [
      {
        "slug": "eko-premiere",
        "title": "Eko Premiere"
      }
    ],
    "generated_at": "2026-06-19T08:35:00+00:00"
  },
  "trend_type": "joins",
  "interval": "5min",
  "labels": [
    "18:00",
    "18:05",
    "18:10"
  ],
  "values": [
    5,
    9,
    4
  ],
  "series": [
    {
      "name": "Eko Premiere",
      "campaign_slug": "eko-premiere",
      "values": [
        5,
        9,
        4
      ]
    }
  ],
  "start_time": "2026-06-19T08:00:00+00:00",
  "end_time": "2026-06-19T08:35:00+00:00",
  "animation_hint": "graph_rise",
  "animation_duration_ms": 1200,
  "pulse_level": "medium",
  "transition_style": "fade_in",
  "scene_targets": [
    "main_stage",
    "chart"
  ],
  "updated_at": "2026-06-19T08:35:00+00:00"
}
```

### Frontend usage

Poll every 10–30 seconds. Use `values` for a single aggregate chart and `series` for multi-campaign charts.

---

## 7. GET `/obs/goal-progress`

Progress bar and milestone endpoint for proof, momentum, and closing scenes.

### Query examples

```http
GET /wp-json/bmh/v1/obs/goal-progress?scope=system
```

```http
GET /wp-json/bmh/v1/obs/goal-progress?scope=campaign&campaign=eko-premiere
```

```http
GET /wp-json/bmh/v1/obs/goal-progress?scope=multi_campaign&campaigns=eko-premiere,splendid-launch
```

### Response

```json
{
  "api_version": "v1_readiness",
  "response_mode": "standard",
  "data_mode": "live",
  "mock_mode": false,
  "scope": {
    "type": "multi_campaign",
    "campaigns": [
      {
        "slug": "eko-premiere",
        "title": "Eko Premiere"
      }
    ],
    "generated_at": "2026-06-19T08:36:00+00:00"
  },
  "goal_name": "Open Enrollment Goal",
  "goal_target": 500,
  "current_value": 235,
  "progress_percent": 47,
  "current_pace": 4.2,
  "target_pace": 5,
  "time_to_goal_projection": "2h 15m",
  "milestone_reached": true,
  "milestone_label": "Almost halfway",
  "breakdown": [
    {
      "campaign_slug": "eko-premiere",
      "campaign_title": "Eko Premiere",
      "goal_target": 500,
      "current_value": 235,
      "progress_percent": 47
    }
  ],
  "animation_hint": "count_up",
  "animation_duration_ms": 1200,
  "pulse_level": "medium",
  "transition_style": "fade_in",
  "scene_targets": [
    "main_stage",
    "progress_bar"
  ],
  "updated_at": "2026-06-19T08:36:00+00:00"
}
```

### Frontend usage

Use for progress bars, milestone pop-ins, and closing proof. Poll every 15–30 seconds.

---

## 8. GET `/obs/session-stats`

Live presentation-session numbers. This endpoint requires `scope=session` and `session_id`.

### Query examples

```http
GET /wp-json/bmh/v1/obs/session-stats?scope=session&session_id=open_enrollment_may_2026
```

```http
GET /wp-json/bmh/v1/obs/session-stats?scope=session&session_id=open_enrollment_may_2026&started_at=2026-06-19T08:00:00Z
```

```http
GET /wp-json/bmh/v1/obs/session-stats?scope=session&session_id=rehearsal_1&data_mode=simulated
```

### Response

```json
{
  "api_version": "v1_readiness",
  "response_mode": "standard",
  "data_mode": "live",
  "mock_mode": false,
  "scope": {
    "type": "session",
    "campaigns": [],
    "session_id": "open_enrollment_may_2026",
    "generated_at": "2026-06-19T08:37:00+00:00"
  },
  "session_id": "open_enrollment_may_2026",
  "started_at": "2026-06-19T08:00:00+00:00",
  "joined_this_session": 12,
  "actions_this_session": 35,
  "referrals_this_session": 9,
  "shares_this_session": 15,
  "qr_scans_this_session": 19,
  "cta_clicks_this_session": 12,
  "signup_completions_this_session": 8,
  "growth_since_start_percent": 8.5,
  "breakdown": [],
  "updated_at": "2026-06-19T08:37:00+00:00"
}
```

### Frontend usage

Poll every 10–15 seconds. Use this for session recaps, closing impact screens, QR conversion moments, and “since this presentation started” counters.

---

## 9. GET `/obs/operator-events`

Reads active public-safe operator/curated events. These are useful for pop-ins, ticker interruptions, milestone moments, and scene emphasis.

### Query examples

```http
GET /wp-json/bmh/v1/obs/operator-events?scope=operator&limit=25
```

```http
GET /wp-json/bmh/v1/obs/operator-events?scope=campaign&campaign=eko-premiere&limit=10
```

```http
GET /wp-json/bmh/v1/obs/operator-events?scope=operator&data_mode=simulated
```

### Response

```json
{
  "api_version": "v1_readiness",
  "response_mode": "standard",
  "data_mode": "live",
  "mock_mode": false,
  "scope": {
    "type": "operator",
    "campaigns": [],
    "generated_at": "2026-06-19T08:38:00+00:00"
  },
  "items": [
    {
      "id": "op_evt_001",
      "event_type": "activity_burst",
      "status": "active",
      "label": "Activity is increasing",
      "message": "Movement spike detected",
      "priority": "critical",
      "display_mode": "pop_in",
      "intensity": "high",
      "value": 5,
      "campaign_slug": "eko-premiere",
      "is_active": true,
      "safe_for_public_display": true,
      "expires_at": "2026-06-19T08:40:00+00:00",
      "timestamp": "2026-06-19T08:38:00+00:00",
      "animation_hint": "pop_in",
      "animation_duration_ms": 800,
      "pulse_level": "high",
      "transition_style": "pop_in",
      "scene_targets": [
        "main_stage",
        "ticker_bottom"
      ]
    }
  ],
  "updated_at": "2026-06-19T08:38:00+00:00"
}
```

### Frontend usage

Poll every 1–2 seconds while a live presentation is active. Render only events with `is_active: true`.

---

## 10. POST `/obs/operator-events`

Creates a curated operator event. This endpoint is admin-only.

Required capability:

- `manage_options`, or
- `bmh_admin_access`

### Headers

Use the same authentication strategy as other protected WordPress/Bema Hub endpoints.

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Payload fields

| Field | Type | Required | Values/Notes |
| --- | --- | --- | --- |
| `event_type` | string | Yes | `activity_burst`, `referral_burst`, `join_burst`, `share_burst`, `milestone_trigger`, `goal_progress_trigger`, `first_action_trigger`, `happening_now_sequence`, `movement_spike` |
| `label` | string | Yes | Short label for pop-in/control UI |
| `message` | string | Yes | Full public display message |
| `priority` | string | Yes | `low`, `medium`, `high`, `critical` |
| `display_mode` | string | Yes | `feed`, `ticker`, `pop_in`, `stat_card`, `progress_bar`, `chart`, `full_scene`, `hidden` |
| `campaign_slug` | string | No | Targets a campaign if provided |
| `duration_seconds` | integer | No | Defaults to `12`; max `86400` |
| `value` | number | No | Optional value to display |
| `intensity` | string | No | Example: `low`, `medium`, `high` |
| `animation_hint` | string | No | Default: `pop_in` |
| `animation_duration_ms` | integer | No | Default: `800` |
| `pulse_level` | string | No | Default: `high` |
| `transition_style` | string | No | Default: `pop_in` |
| `scene_targets` | array/string | No | Example: `["main_stage", "ticker_bottom"]` |
| `safe_for_public_display` | boolean | No | Defaults to `true` |

### Request

```http
POST /wp-json/bmh/v1/obs/operator-events
Content-Type: application/json
Authorization: Bearer <token>
```

```json
{
  "event_type": "join_burst",
  "label": "Join activity rising",
  "message": "Several new people are joining now",
  "priority": "critical",
  "display_mode": "pop_in",
  "campaign_slug": "eko-premiere",
  "duration_seconds": 12,
  "value": 5,
  "intensity": "high",
  "animation_hint": "pop_in",
  "animation_duration_ms": 800,
  "pulse_level": "high",
  "transition_style": "pop_in",
  "scene_targets": [
    "main_stage",
    "ticker_bottom"
  ],
  "safe_for_public_display": true
}
```

### Response

```json
{
  "api_version": "v1_readiness",
  "response_mode": "standard",
  "data_mode": "live",
  "mock_mode": false,
  "scope": {
    "type": "operator",
    "campaigns": [
      {
        "slug": "eko-premiere",
        "title": "Eko Premiere"
      }
    ],
    "generated_at": "2026-06-19T08:38:00+00:00"
  },
  "item": {
    "id": "op_evt_001",
    "event_type": "join_burst",
    "status": "active",
    "label": "Join activity rising",
    "message": "Several new people are joining now",
    "priority": "critical",
    "display_mode": "pop_in",
    "intensity": "high",
    "value": 5,
    "campaign_slug": "eko-premiere",
    "is_active": true,
    "safe_for_public_display": true,
    "expires_at": "2026-06-19T08:38:12+00:00",
    "timestamp": "2026-06-19T08:38:00+00:00",
    "animation_hint": "pop_in",
    "animation_duration_ms": 800,
    "pulse_level": "high",
    "transition_style": "pop_in",
    "scene_targets": [
      "main_stage",
      "ticker_bottom"
    ]
  },
  "updated_at": "2026-06-19T08:38:00+00:00"
}
```

### Frontend usage

Use this from a protected operator/admin panel, not from public OBS scenes. OBS scenes should poll `GET /obs/operator-events`.

---

## 11. GET `/obs/presenter-state`

Presenter/lower-third state for host-integrated scenes.

### Query examples

```http
GET /wp-json/bmh/v1/obs/presenter-state?scope=system
```

```http
GET /wp-json/bmh/v1/obs/presenter-state?scope=campaign&campaign=eko-premiere
```

### Response

```json
{
  "api_version": "v1_readiness",
  "response_mode": "standard",
  "data_mode": "live",
  "mock_mode": false,
  "scope": {
    "type": "system",
    "campaigns": [],
    "generated_at": "2026-06-19T08:39:00+00:00"
  },
  "presenter": {
    "presenter_name": "Bema Host",
    "presenter_title": "Open Enrollment Host",
    "presenter_avatar": "https://example.com/avatar.jpg",
    "presenter_status": "ready",
    "current_scene": "welcome",
    "speaker_mode": "speaker_overlay",
    "camera_layout": "integrated",
    "active_campaign": "eko-premiere",
    "active_topic": "Open Enrollment",
    "talking_points": [
      "Welcome everyone",
      "Explain the movement",
      "Invite viewers to scan"
    ],
    "lower_third_enabled": true
  },
  "updated_at": "2026-06-19T08:39:00+00:00"
}
```

### Frontend usage

Poll every 5–15 seconds for lower thirds, speaker overlays, and host-facing scene prompts.

---

## 12. GET `/obs/presentation-sequence`

Returns the recommended presentation scene flow.

### Query examples

```http
GET /wp-json/bmh/v1/obs/presentation-sequence?scope=system
```

```http
GET /wp-json/bmh/v1/obs/presentation-sequence?scope=multi_campaign&campaigns=eko-premiere,splendid-launch
```

### Response

```json
{
  "api_version": "v1_readiness",
  "response_mode": "standard",
  "data_mode": "live",
  "mock_mode": false,
  "scope": {
    "type": "system",
    "campaigns": [],
    "generated_at": "2026-06-19T08:40:00+00:00"
  },
  "sequence_id": "open_enrollment_v1",
  "scenes": [
    {
      "scene_order": 1,
      "scene_type": "intro",
      "duration_seconds": 30,
      "transition_style": "fade_in",
      "scene_goal": "narrative_momentum",
      "primary_metric": "total_joined",
      "secondary_metric": null,
      "operator_notes": "",
      "auto_advance": false,
      "next_scene_trigger": "operator"
    },
    {
      "scene_order": 2,
      "scene_type": "movement",
      "duration_seconds": 30,
      "transition_style": "fade_in",
      "scene_goal": "narrative_momentum",
      "primary_metric": "total_joined",
      "secondary_metric": null,
      "operator_notes": "",
      "auto_advance": false,
      "next_scene_trigger": "operator"
    },
    {
      "scene_order": 3,
      "scene_type": "live_activity",
      "duration_seconds": 30,
      "transition_style": "fade_in",
      "scene_goal": "narrative_momentum",
      "primary_metric": "total_joined",
      "secondary_metric": "activity_per_minute",
      "operator_notes": "",
      "auto_advance": false,
      "next_scene_trigger": "operator"
    }
  ],
  "updated_at": "2026-06-19T08:40:00+00:00"
}
```

### Frontend usage

Use this as the presentation engine’s scene map. The frontend can still allow manual override from OBS/operator controls.

---

## Enums

### Scope

```txt
system
campaign
multi_campaign
session
operator
```

### Data mode

```txt
live
simulated
hybrid
```

### Response mode

```txt
compact
standard
expanded
```

### Priority

```txt
low
medium
high
critical
```

### Display mode

```txt
feed
ticker
pop_in
stat_card
progress_bar
chart
full_scene
hidden
```

### Operator event type

```txt
activity_burst
referral_burst
join_burst
share_burst
milestone_trigger
goal_progress_trigger
first_action_trigger
happening_now_sequence
movement_spike
```

### Trend type

```txt
joins
shares
actions
conversions
referrals
support
activity
qr_scans
cta_clicks
campaign_progress
```

### Time interval

```txt
1min
5min
10min
15min
30min
1hour
1day
```

### Campaign status

```txt
draft
scheduled
live
paused
completed
archived
```

### Animation hint

```txt
count_up
slide_in
pulse
glow
ticker_scroll
graph_rise
milestone_flash
fade_in
pop_in
ambient_shift
```

## Recommended polling intervals

| Scene/data type | Recommended polling |
| --- | --- |
| Operator events | 1–2 seconds |
| Live activity feed | 2–3 seconds |
| Ticker | 2–5 seconds |
| Main stats | 5–10 seconds |
| QR metrics | 5–10 seconds |
| Session stats | 10–15 seconds |
| Trend graphs | 10–30 seconds |
| Campaign progress | 15–30 seconds |

## Error examples

Invalid scope:

```json
{
  "code": "invalid_obs_scope",
  "message": "Invalid OBS scope.",
  "data": {
    "status": 400
  }
}
```

Missing campaign for campaign scope:

```json
{
  "code": "obs_campaign_required",
  "message": "scope=campaign requires exactly one campaign slug.",
  "data": {
    "status": 400
  }
}
```

Missing session ID:

```json
{
  "code": "obs_session_required",
  "message": "session_id is required for session scope.",
  "data": {
    "status": 400
  }
}
```

Unauthorized operator-event write:

```json
{
  "code": "rest_forbidden",
  "message": "Sorry, you are not allowed to do that.",
  "data": {
    "status": 401
  }
}
```

## Quick JavaScript usage

```ts
const OBS_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") + "/obs";

async function getObsLiveStats() {
  const params = new URLSearchParams({
    scope: "multi_campaign",
    campaigns: "eko-premiere,splendid-launch",
    data_mode: "live",
  });

  const response = await fetch(`${OBS_BASE}/live-stats?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`OBS live-stats failed: ${response.status}`);
  }

  return response.json();
}
```

```ts
async function triggerOperatorEvent(token: string) {
  const response = await fetch(`${OBS_BASE}/operator-events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      event_type: "join_burst",
      label: "Join activity rising",
      message: "Several new people are joining now",
      priority: "critical",
      display_mode: "pop_in",
      duration_seconds: 12,
      scene_targets: ["main_stage", "ticker_bottom"],
    }),
  });

  if (!response.ok) {
    throw new Error(`OBS operator event failed: ${response.status}`);
  }

  return response.json();
}
```

## Important implementation notes

- Do not hardcode metrics in OBS/frontend scenes.
- Use `data_mode=simulated` for rehearsals and visual development.
- Keep rendering logic separate from the data source.
- Treat `safe_for_public_display` as mandatory before showing user-related activity.
- Operator POST should only be used from protected admin/operator UI.
- The OBS layer should not block core Bema Hub MVP delivery.
