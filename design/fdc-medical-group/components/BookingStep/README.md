# BookingStep

Page template for one step of a booking flow: back link, progress, the question as the page heading, error summary, fields, one primary action and the hotline.

Ask one question per page; keep the title under about 60 characters. The consumer supplies the fields as children and handles `onContinue`. The hotline sits in the same place on every step (clinic number by default; pass the nursing home's for its flows).

Place it inside SiteLayout, which provides the page's single `<main>`. In a single-page flow pass `onBack` instead of `backHref`, and move focus to the new step after each change.
