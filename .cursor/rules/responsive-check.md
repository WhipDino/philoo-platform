# Responsiveness checklist

Use this whenever you change UI, layout, styling, routing chrome, or a page
that a student can see. Do not mark the work done until every listed width
passes.

## Viewports

Fixed height: **900px**. Widths, in this order:

| Name | Width |
| --- | --- |
| Small phone | 320px |
| Phone | 375px |
| Tablet | 768px |
| Small laptop | 1024px |
| Laptop | 1280px |
| Desktop | 1440px |
| Wide | 1920px |

Start the local app if it is not running (`npm run dev`, usually
`http://localhost:3000`). Drive the browser with the **Playwright MCP**
server (`playwright`: `browser_navigate`, `browser_resize`,
`browser_take_screenshot`, `browser_snapshot`, `browser_evaluate`). Prefer
Playwright over the Cursor IDE browser for this checklist so width is exact.

## At every width

- [ ] No page-level **horizontal** scrollbar or overflow (`document.documentElement.scrollWidth <= innerWidth`)
- [ ] Text, titles, and buttons are fully visible: not clipped, not overlapping
- [ ] Interactive targets stay at least 44px tall where the student must tap
- [ ] Images are not stretched; crop is intentional (`object-fit` / 16:9 stages, not a smashed panoramic leftover)
- [ ] Nav and side panels collapse or stack on purpose (left nav → tab bar; “Onde você está” caret when the rail is tight)
- [ ] Nothing required for the task disappears (primary CTA, current lesson, search on widths that still have it)
- [ ] Spacing does not collapse to zero or explode into empty bands
- [ ] Philoo composition rules still hold: wrap or scroll long rows; one card column on narrow screens unless the product is a horizontal rail

## After screenshots

If anything fails, fix CSS with flex/grid and fluid units (`%`, `fr`,
`minmax`, `clamp`, `auto-fit` / `auto-fill`) and container queries. Avoid new
fixed pixel widths/heights unless a tactile control needs a minimum size.
Re-screenshot the failing widths. Report what you tested, what you fixed, and
any frame that is only borderline.
