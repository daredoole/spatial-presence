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
┌ floor switcher ─────────────── fit  layers  edit ┐
│                                                  │
│             viewport-sized house map             │
│                                                  │
│                                  selected sensor │
└──────────────────────────────────────────────────┘
```

On phones, the inspector becomes a bottom sheet. The document never grows to
the floorplan's aspect ratio: pan and zoom remain inside the map viewport.

The memorable element is the live spatial field: soft concentric confidence
bands and crisp target tracks over a restrained architectural drawing. Avoid a
generic grid of cards, decorative gradients and ambient animation.

