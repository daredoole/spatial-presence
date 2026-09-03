# Interface direction

Spatial Presence should feel like a quiet instrument panel. The house is the
primary object, live motion is immediately legible, and configuration stays
hidden until requested.

## Tokens

| Role | Value |
|---|---|
| Blueprint ink | `#14232B` |
| Floor paper | `#F6F8F7` |
| Radar teal | `#00A7A5` |
| Heading amber | `#F2A93B` |
| Target magenta | `#C026D3` |
| Muted slate | `#647681` |

Typography inherits Home Assistant's interface family. Weight, spacing and
scale establish hierarchy; the card downloads no decorative font.

## Layout

```text
┌ floor switcher · 2 targets · 1/1 online · layers ┐
│                                                  │
│             viewport-sized house map             │
│                                                  │
│                                  selected sensor │
└──────────────────────────────────────────────────┘
```

On phones, the inspector becomes a bottom sheet. The document never grows to
the floorplan's aspect ratio: pan and zoom remain inside the map viewport.
The normal card is six dashboard rows and capped at 680 pixels / 64dvh; mobile
is capped at 620 pixels / 68dvh. The entire floor is fitted on load and after a
floor change. Live target and radar counts stay in the compact header, while
larger magenta target halos remain legible when a tall plan is scaled down.

Calibration stays inside the selected-radar inspector so the map remains the
working surface. It is a two-step field procedure, not a settings form:

```text
place radar marker → choose a live target → click the known floor position
```

The teal left rule identifies an active calibration without adding another
floating card. Amber marks the completed result because it already means
orientation in the radar glyph. Buttons use exact verbs and errors explain the
next recoverable action. Keyboard focus, reduced motion and the mobile bottom
sheet behavior remain unchanged.

The memorable element is the live spatial field: soft concentric confidence
bands and crisp target tracks over a restrained architectural drawing. Avoid a
generic grid of cards, decorative gradients and ambient animation.

This flow was checked against the project's subject: a generic multi-step
dialog would obscure the floorplan and separate the physical action from its
spatial result. Keeping one restrained instrument panel over the live map is
specific to radar alignment and preserves the interface's single memorable
element.
